// app/api/model/PurchaseModel.js
import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userForm",
    required: true,
  },
  item: [
    {
      product_id: String,
      product_name: String,
      product_price: Number,
      product_quantity: Number,
    },
  ],
  totalAmount: Number,
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const Purchase = mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);

export default Purchase;
