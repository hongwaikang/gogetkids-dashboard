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
        default: '',
    },
    company_name: {
        type: String,
        required: true,
        unique: true,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
        required: [true, "Please provide an address"],
    },
    postalcode: {
        type: Number,
        required: [true, "Please provide a postal code"],
    },
    role: {
        type: String,
        enum: ['school admin', 'system admin', 'transport admin'],
        default: 'school admin',
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
});

const User = mongoose.models.adminUsers || mongoose.model("adminUsers", userSchema);

export default User;
