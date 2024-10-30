import mongoose, { Schema, model } from "mongoose"

const schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [false],
      minlength: [2, "Too short SubCategory name"],
      maxlength: [32, "Too long SubCategory name"],
      // تأكد من عدم وجود قيود فريدة هنا
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to a parent category"],
    },
  },
  { timestamps: true, versionKey: false, toJSON: { virtuals: true }, id: false }
)

// إضافة العلاقة الافتراضية مع المنتجات
schema.virtual("SubCategoryProducts", {
  ref: "Product",
  localField: "_id",
  foreignField: "SubCategory",
})

// Populate الافتراضية عند البحث
schema.pre(/^find/, function () {
  this.populate("SubCategoryProducts")
})

export const SubCategory = model("SubCategory", schema)
