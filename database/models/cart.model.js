import { model, Schema, Types } from "mongoose"

const schema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: Types.ObjectId,
          ref: "Product",
        },
        price: Number,
      },
    ],
    totalCartPrice: Number,
    Discount: Number,
    totalCartPriceAfterDiscount: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const Cart = model("Cart", schema)
