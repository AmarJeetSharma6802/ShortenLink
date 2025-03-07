import mongoose from "mongoose";

const ShortenLinkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const ShortenLink = mongoose.models.shortlink || mongoose.model("shortlink", ShortenLinkSchema);

export default ShortenLink;

// const allLinks = await ShortenLink.find();
// console.log("allLinks", allLinks);