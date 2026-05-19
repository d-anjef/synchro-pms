import axios from 'axios';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { PLANS } from '../utils/plans.js';
import {
  generateProductId,
  generateEsewaSignature,
  calculateEndDate,
} from '../utils/paymentHelpers.js';

// @desc    Initiate eSewa payment
// @route   POST /api/payment/esewa/initiate
// @access  Private
export const initiateEsewa = async (req, res, next) => {
  try {
    const { planId, billingCycle = 'monthly' } = req.body;
    const plan = PLANS[planId];
    if (!plan || planId === 'free' || planId === 'enterprise') {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const amount = plan.price[billingCycle];
    const productId = generateProductId(req.user._id);

    // Create pending payment record
    const payment = await Payment.create({
      user: req.user._id,
      provider: 'esewa',
      planId,
      billingCycle,
      amount,
      productId,
      status: 'pending',
    });

    // Generate eSewa signature
    const signedFieldNames = 'total_amount,transaction_uuid,product_code';
    const message = `total_amount=${amount},transaction_uuid=${productId},product_code=${process.env.ESEWA_MERCHANT_CODE}`;
    const signature = generateEsewaSignature(process.env.ESEWA_SECRET_KEY, message);

    payment.signature = signature;
    await payment.save();

    // Build form data for eSewa redirect
    const formData = {
      amount: String(amount),
      tax_amount: '0',
      total_amount: String(amount),
      transaction_uuid: productId,
      product_code: process.env.ESEWA_MERCHANT_CODE,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${process.env.SERVER_URL}/api/payment/esewa/success`,
      failure_url: `${process.env.SERVER_URL}/api/payment/esewa/failure`,
      signed_field_names: signedFieldNames,
      signature,
    };

    res.json({
      success: true,
      paymentUrl: process.env.ESEWA_PAYMENT_URL,
      formData,
      productId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    eSewa payment success callback
// @route   GET /api/payment/esewa/success
// @access  Public
export const esewaSuccess = async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) {
      return res.redirect(`${process.env.CLIENT_URL}/billing?error=invalid_response`);
    }

    // Decode base64 response from eSewa
    const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    const { transaction_uuid, status, total_amount, transaction_code } = decoded;

    const payment = await Payment.findOne({ productId: transaction_uuid });
    if (!payment) {
      return res.redirect(`${process.env.CLIENT_URL}/billing?error=payment_not_found`);
    }

    if (status === 'COMPLETE') {
      // Update payment
      payment.status = 'completed';
      payment.transactionId = transaction_code;
      payment.rawResponse = decoded;
      await payment.save();

      // Activate subscription
      const endDate = calculateEndDate(payment.billingCycle);
      await User.findByIdAndUpdate(payment.user, {
        'subscription.plan': payment.planId,
        'subscription.status': 'active',
        'subscription.billingCycle': payment.billingCycle,
        'subscription.currentPeriodEnd': endDate,
        'subscription.trialEndsAt': null,
      });

      return res.redirect(`${process.env.CLIENT_URL}/billing?success=true&provider=esewa`);
    }

    payment.status = 'failed';
    payment.rawResponse = decoded;
    await payment.save();
    return res.redirect(`${process.env.CLIENT_URL}/billing?error=payment_failed`);
  } catch (error) {
    console.error('eSewa success handler error:', error);
    return res.redirect(`${process.env.CLIENT_URL}/billing?error=server_error`);
  }
};

// @desc    eSewa payment failure callback
// @route   GET /api/payment/esewa/failure
// @access  Public
export const esewaFailure = async (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/billing?error=payment_cancelled`);
};

// @desc    Initiate Khalti payment
// @route   POST /api/payment/khalti/initiate
// @access  Private
export const initiateKhalti = async (req, res, next) => {
  try {
    const { planId, billingCycle = 'monthly' } = req.body;
    const plan = PLANS[planId];
    if (!plan || planId === 'free' || planId === 'enterprise') {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const amount = plan.price[billingCycle];
    const productId = generateProductId(req.user._id);

    // Create pending payment
    const payment = await Payment.create({
      user: req.user._id,
      provider: 'khalti',
      planId,
      billingCycle,
      amount,
      productId,
      status: 'pending',
    });

    // Khalti accepts amount in paisa (1 NPR = 100 paisa)
    const payload = {
      return_url: `${process.env.SERVER_URL}/api/payment/khalti/verify`,
      website_url: process.env.CLIENT_URL,
      amount: amount * 100, // convert to paisa
      purchase_order_id: productId,
      purchase_order_name: `${plan.name} ${billingCycle}`,
      customer_info: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '9800000000',
      },
    };

    const response = await axios.post(
      process.env.KHALTI_INIT_URL,
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { pidx, payment_url } = response.data;

    payment.pidx = pidx;
    await payment.save();

    res.json({
      success: true,
      paymentUrl: payment_url,
      pidx,
    });
  } catch (error) {
    console.error('Khalti initiate error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.detail || 'Failed to initiate Khalti payment',
    });
  }
};

// @desc    Khalti payment verification callback
// @route   GET /api/payment/khalti/verify
// @access  Public
export const khaltiVerify = async (req, res) => {
  try {
    const { pidx, status } = req.query;
    if (!pidx) {
      return res.redirect(`${process.env.CLIENT_URL}/billing?error=invalid_response`);
    }

    const payment = await Payment.findOne({ pidx });
    if (!payment) {
      return res.redirect(`${process.env.CLIENT_URL}/billing?error=payment_not_found`);
    }

    // Verify payment with Khalti
    const response = await axios.post(
      process.env.KHALTI_VERIFY_URL,
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verification = response.data;

    if (verification.status === 'Completed') {
      payment.status = 'completed';
      payment.transactionId = verification.transaction_id;
      payment.rawResponse = verification;
      await payment.save();

      const endDate = calculateEndDate(payment.billingCycle);
      await User.findByIdAndUpdate(payment.user, {
        'subscription.plan': payment.planId,
        'subscription.status': 'active',
        'subscription.billingCycle': payment.billingCycle,
        'subscription.currentPeriodEnd': endDate,
        'subscription.trialEndsAt': null,
      });

      return res.redirect(`${process.env.CLIENT_URL}/billing?success=true&provider=khalti`);
    }

    payment.status = 'failed';
    payment.rawResponse = verification;
    await payment.save();
    return res.redirect(`${process.env.CLIENT_URL}/billing?error=payment_failed`);
  } catch (error) {
    console.error('Khalti verify error:', error.response?.data || error.message);
    return res.redirect(`${process.env.CLIENT_URL}/billing?error=server_error`);
  }
};

// @desc    Get user's payment history
// @route   GET /api/payment/history
// @access  Private
export const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel subscription (downgrade to free)
// @route   POST /api/payment/cancel
// @access  Private
export const cancelSubscription = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.plan': 'free',
      'subscription.status': 'canceled',
      'subscription.cancelAtPeriodEnd': true,
    });
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    next(error);
  }
};