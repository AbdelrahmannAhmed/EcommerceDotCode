import { Schema, model } from "mongoose"
// Create Schema
const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true, versionKey: false, toJSON: { virtuals: true }, id: false }
)

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${doc.image}`
    doc.image = imageUrl
  }
}
// findOne, findAll and update
schema.post("init", (doc) => {
  setImageURL(doc)
})

// create
schema.post("save", (doc) => {
  setImageURL(doc)
})

// schema.virtual("CategoryProducts", {
//   ref: "Product",
//   localField: "_id",
//   foreignField: "category",
// })

// schema.pre(/^find/, function () {
//   this.populate("CategoryProducts")
// })

// Create model
export const Category = model("Category", schema)
