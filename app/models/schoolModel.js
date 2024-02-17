import mongoose from "mongoose";

const schoolSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        unique: true,
    },
    address: {
        type: String,
        required: [true, "Please provide an address"],
    },
    postal_code: {
        type: String,
        required: [true, "Please provide a postal code"],
    },
});

const School = mongoose.models.schools || mongoose.model("schools", schoolSchema);

export default School;
