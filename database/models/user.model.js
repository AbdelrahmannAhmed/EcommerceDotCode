import { model, Schema } from "mongoose"

// استيراد bcryptjs كحزمة افتراضية
import pkg from "bcryptjs"
const { hash } = pkg // استخراج الدالة hash

const schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
)

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  // Hashing user password
  this.password = await hash(this.password, 12)
  next()
})

export const User = model("User", schema)
