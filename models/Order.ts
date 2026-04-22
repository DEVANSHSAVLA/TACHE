import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: false }, // Optional for guest checkout if allowed later
        name: { type: String, required: true },
        email: { type: String, required: true },
        artworkType: { type: String, required: true },
        size: { type: String, required: true },
        message: { type: String, required: true },
        referenceImage: { type: String, required: false },
        status: { type: String, enum: ["pending", "in-progress", "completed", "cancelled"], default: "pending" },
    },
    { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);
export default Order;
