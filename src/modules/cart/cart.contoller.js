import { Cart } from "../../../database/models/cart.model.js"
// import { Coupon } from "../../../database/models/coupon.model.js";
import { Product } from "../../../database/models/product.model.js"
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utlities/appError.js"
import { messages } from "../../utlities/messages.js"

function calcTotalPrice(isCartExist) {
  isCartExist.totalCartPrice = isCartExist.cartItems.reduce((total, item) => {
    return (total += item.price * item.quantity)
  }, 0)

  if (isCartExist.Discount) {
    console.log(isCartExist)

    isCartExist.totalCartPriceAfterDiscount = isCartExist.totalCartPrice - (isCartExist.totalCartPrice * isCartExist.Discount) / 100
  }
}
const addCart = catchError(async (req, res, next) => {
  let isCartExist = await Cart.findOne({ userId: req.user._id })
  let product = await Product.findById({ _id: req.body.product })
  if (!product) next(new AppError("Product is not found", 404))
  req.body.price = product.price
  if (product.stock < req.body.quantity) return res.json({ message: "There is not enough stock for this product" })
  if (!isCartExist) {
    let cart = new Cart({
      userId: req.user._id,
      cartItems: [req.body],
    })
    calcTotalPrice(cart)
    await cart.save()
    res.status(201).json({ message: messages.cart.addedSuccessfully, data: cart })
  } else {
    let item = isCartExist.cartItems.find((item) => item.product == req.body.product)
    if (item) {
      item.quantity += req.body.quantity || 1
      if (product.stock < item.quantity) return res.json({ message: "There is not enough stock for this product" })
    }
    if (!item) {
      isCartExist.cartItems.push(req.body)
    }
    calcTotalPrice(isCartExist)
    await isCartExist.save()
    res.json({ message: "Cart updated successfully", isCartExist })
  }
})

const updateQuantity = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ userId: req.user._id })
  let item = cart.cartItems.find((item) => item.product == req.params.id)
  if (!item) return next(new AppError("Product is not found", 404))
  if (req.body.quantity >= 0) {
    item.quantity = req.body.quantity
  } else {
    res.json({ message: "Quantity must be zero or more" })
  }
  console.log(item)
  calcTotalPrice(cart)
  cart.save()
  console.log(cart)
  res.json({ message: "Quantity updated successfully", cart })
})

const removeItemfromCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndUpdate({ userId: req.user._id }, { $pull: { cartItems: { product: req.params.id } } }, { new: true })
  calcTotalPrice(cart)
  await cart.save()

  cart || next(new AppError(messages.user.notFound, 404))
  !cart || res.status(200).json({ message: "Removed from cart Successfully", cart })
})

const getLoggedUserCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ userId: req.user._id })
  cart || next(new AppError(messages.cart.notFound, 404))
  !cart || res.status(200).json({ message: "User Cart", cart })
})

const clearUserCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndDelete({ userId: req.user._id })
  res.status(200).json({ message: "Cart Cleared successfully", cart })
})

// const applyCoupon = catchError(async (req, res, next) => {
//     let coupon = await Coupon.findOne({ code: req.body.code, expires: { $gte: Date.now() } })
//     if (!coupon) return next(new AppError('Coupon is Invalid', 404))
//     let cart = await Cart.findOne({ userId: req.user._id })
//     cart.Discount = coupon.discount
//     cart.totalCartPriceAfterDiscount = cart.totalCartPrice - (cart.totalCartPrice * coupon.discount) / 100
//     await cart.save()
//     res.status(200).json({ message: 'Coupon applied successfuly', cart })
// })

export { addCart, updateQuantity, removeItemfromCart, getLoggedUserCart, clearUserCart }
