import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  teamMembers: mongoose.Types.ObjectId[];
  status: 'Active' | 'Completed' | 'OnHold';
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teamMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Completed', 'OnHold'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
