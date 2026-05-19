import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['admin', 'project_manager', 'team_member', 'client'],
      default: 'team_member',
    },
    jobTitle: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 300 },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    preferences: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      notifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'business', 'enterprise'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'trialing', 'past_due', 'canceled', 'incomplete'],
        default: 'active',
      },
      billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly',
      },
      trialEndsAt: { type: Date },
      currentPeriodEnd: { type: Date },
      cancelAtPeriodEnd: { type: Boolean, default: false },
      stripeCustomerId: { type: String },
      stripeSubscriptionId: { type: String },
      stripePriceId: { type: String },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('save', async function () {
  if (!this.isNew) return;
  if (this.subscription && this.subscription.trialEndsAt) return;
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);
  this.subscription = {
    plan: 'pro',
    status: 'trialing',
    billingCycle: 'monthly',
    trialEndsAt: trialEnd,
  };
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
