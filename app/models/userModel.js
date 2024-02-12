import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    firstname: {
        type: String,
        required: [true, "Please provide a firstname"],
    },
    lastname: {
        type: String,
        required: [true, "Please provide a lastname"],
    },
    school_name: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['school admin', 'system admin'],
        default: 'school admin',
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
});

const User = mongoose.models.adminUsers || mongoose.model("adminUsers", userSchema);

export default User;
