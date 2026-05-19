import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: String,
      enum: ['esewa', 'khalti'],
      required: true,
    },
    planId: {
      type: String,
      enum: ['pro', 'business'],
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NPR' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    // Provider-specific transaction references
    transactionId: { type: String },
    pidx: { type: String }, // Khalti payment index
    productId: { type: String }, // Custom unique ID we generate
    signature: { type: String }, // For eSewa
    rawResponse: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ productId: 1 }, { unique: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;