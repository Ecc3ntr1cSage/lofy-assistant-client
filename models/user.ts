import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUserMetadata {
    profession: string;
    source: string;
    about_yourself: string;
}

interface IUser extends Document {
    PIN: string;
    phone_number: string;
    nickname: string;
    email: string;
    language: string;
    metadata: IUserMetadata;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
    hashed_phone_number: string;
    onboarding_completed: boolean;
    roles: string;
}

const UserMetadataSchema = new Schema<IUserMetadata>({
    profession: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    about_yourself: {
        type: String,
        default: ""
    }
});

const UserSchema = new Schema<IUser>({
    PIN: {
        type: String,
        required: true,
        unique: true
    },
    phone_number: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    language: {
        type: String,
        required: true,
        default: "English"
    },
    metadata: {
        type: UserMetadataSchema,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date,
        default: Date.now
    },
    hashed_phone_number: {
        type: String,
        required: true
    },
    onboarding_completed: {
        type: Boolean,
        default: false
    },
    roles: {
        type: String,
        default: "user"
    }
});

// Update the updated_at field before saving
UserSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
export type { IUser, IUserMetadata };