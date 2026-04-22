import mongoose, { Schema, model, models } from "mongoose";

const ArtworkSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
    },
    { timestamps: true }
);

const Artwork = models.Artwork || model("Artwork", ArtworkSchema);
export default Artwork;
