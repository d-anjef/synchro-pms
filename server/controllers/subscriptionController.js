import stripe, { STRIPE_PRICES } from '../config/stripe.js';
import User from '../models/User.js';
import { PLANS, getPlan } from '../utils/plans.js';

// @desc    Get all available plans
// @route   GET /api/subscription/plans
// @access  Public
export const getPlans = async (req, res) => {
  res.json({ success: true, plans: PLANS });
};

// @desc    Get current user's subscription
// @route   GET /api/subscription
// @access  Private
export const getMySubscription = async (req, res) => {
  const user = await User.findById(req.user._id);
  const plan = getPlan(user.subscription?.plan);

  res.json({
    success: true,
    subscription: user.subscription,
    plan,
  });
};

// @desc    Create Stripe checkout session
// @route   POST /api/subscription/checkout
// @access  Private
export const createCheckoutSession = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(400).json({
        success: false,
        message: 'Stripe is not configured on the server',
      });
    }

    const { planId, billingCycle = 'monthly' } = req.body;
    if (!['pro', 'business'].includes(planId)) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const priceKey = `${planId}_${billingCycle}`;
    const priceId = STRIPE_PRICES[priceKey];
    if (!priceId) {
      return res.status(400).json({ success: false, message: 'Price not configured' });
    }

    let customerId = req.user.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: String(req.user._id) },
      });
      customerId = customer.id;

      await User.findByIdAndUpdate(req.user._id, {
        'subscription.stripeCustomerId': customerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
      metadata: { userId: String(req.user._id), planId, billingCycle },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Stripe customer portal session
// @route   POST /api/subscription/portal
// @access  Private
export const createPortalSession = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(400).json({ success: false, message: 'Stripe is not configured' });
    }
    const customerId = req.user.subscription?.stripeCustomerId;
    if (!customerId) {
      return res.status(400).json({ success: false, message: 'No active subscription' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/billing`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe webhook
// @route   POST /api/subscription/webhook
// @access  Public (Stripe-verified)
export const handleWebhook = async (req, res) => {
  if (!stripe) return res.status(400).send('Stripe not configured');

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const billingCycle = session.metadata?.billingCycle;
        if (userId) {
          await User.findByIdAndUpdate(userId, {
            'subscription.plan': planId,
            'subscription.status': 'active',
            'subscription.billingCycle': billingCycle,
            'subscription.stripeSubscriptionId': session.subscription,
            'subscription.trialEndsAt': null,
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object;
        const user = await User.findOne({
          'subscription.stripeCustomerId': sub.customer,
        });
        if (user) {
          user.subscription.status = sub.status;
          user.subscription.currentPeriodEnd = new Date(sub.current_period_end * 1000);
          user.subscription.cancelAtPeriodEnd = sub.cancel_at_period_end;
          user.subscription.stripeSubscriptionId = sub.id;
          await user.save();
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const user = await User.findOne({
          'subscription.stripeCustomerId': sub.customer,
        });
        if (user) {
          user.subscription.plan = 'free';
          user.subscription.status = 'canceled';
          user.subscription.stripeSubscriptionId = null;
          await user.save();
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// @desc    Manually set plan (admin only — for testing/dev)
// @route   POST /api/subscription/manual-upgrade
// @access  Private (admin)
export const manualUpgrade = async (req, res, next) => {
  try {
    const { planId } = req.body;
    if (!PLANS[planId]) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'subscription.plan': planId,
        'subscription.status': 'active',
        'subscription.trialEndsAt': null,
      },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};