import mongoose, { Schema } from "mongoose";

const userSchema = Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImagePath: {
        type: String,
        default: ""
    },
    tripList: {
        type: Array,
        default: []
    },
    wishList: {
        type: Array,
        default: []
    },
    propertyList: {
        type: Array,
        default: []
    },
    reservationList: {
        type: Array,
        default: []
    },
},
{
    timestamps: true
}
)

export const User = mongoose.model("User", userSchema)