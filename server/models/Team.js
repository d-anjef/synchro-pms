import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: 80,
    },
    description: { type: String, default: '', maxlength: 500 },
    icon: { type: String, default: '👥' },
    color: { type: String, default: '#6366f1' },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['admin', 'manager', 'member'],
          default: 'member',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Team = mongoose.model('Team', teamSchema);
export default Team;