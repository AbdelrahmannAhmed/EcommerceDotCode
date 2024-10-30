import { model, Schema, Types } from "mongoose"

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "product name must be unique"],
      minlength: [3, "product name Must be at least 3 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      unique: [true, "product slug must be unique"],
    },
    Desc: {
      type: String,
      required: true,
      minlength: [10, "minlength name Must be at least 10 characters"],
      maxlength: [2000, "maxlength name Must be at least 2000 characters"],
    },
    image: String,
    images: [String],
    price: {
      type: Number,
      required: true,
      min: [0, "Product price cannot be negative"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "Product price cannot be negative"],
    },
    soldItems: Number,
    stock: {
      type: Number,
      min: [0, "Product stock cannot be negative"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    SubCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    Brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    rateavg: {
      type: Number,
      minlength: [0, "Rating cannot be negative"],
      maxlength: [5, "Rating cannot be more than 5."],
    },
    rateCount: Number,
    createdby: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // Add size and colors fields
    size: {
      type: [String], // Array of strings
      enum: ["XS", "S", "M", "L", "XL"], // Possible values
    },
    colors: {
      type: [String], // Array of strings without enum
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
  }
)

// Function to set image URL
const setImageURL = (doc) => {
  if (doc.image) {
    doc.image = `${doc.image}`
  }
  if (Array.isArray(doc.images)) {
    doc.images = doc.images.map((image) => `${image}`)
  }
}

// FindOne, FindAll and Update
schema.post("init", (doc) => {
  setImageURL(doc)
})

// Create
schema.post("save", (doc) => {
  setImageURL(doc)
})

export const Product = model("Product", schema)
