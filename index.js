import cors from "cors"
import "dotenv/config"
import express from "express"
import Stripe from "stripe"
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.js"
import { bootstrap } from "./src/modules/bootstrap.js"
import { AppError } from "./src/utlities/appError.js"
import morgan from "morgan"
import { dbConnection } from "./database/dbConnection.js"
import { catchError } from "./src/middleware/catchError.js"
import nodemailer from "nodemailer"
import { allowedTo, protect } from "./src/modules/auth/auth.controller.js"

const stripe = new Stripe(`sk_test_51QEA3sAowarrLGcX5EngHbFxpqjaK5U1nuV69yf0cDLoXJFDeWcnopd4C5XgEviigUxFgOlQgkIQQIHMhjyFn5Vf00PE1SEQyO`)

const app = express()
const port = process.env.PORT || 3000
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  catchError(async (req, res) => {
    const sig = req.headers["stripe-signature"].toString()
    let event = stripe.webhooks.constructEvent(req.body, sig, "whsec_XdRxm4HvyuNx8ccedonlrBjk15hXYvnM")

    let checkout
    if (event.type == "checkout.session.completed") {
      checkout = event.data.object
      let user = await User.findOne({ email: checkout.customer_email })
      let cart = await Cart.findById(checkout.client_reference_id)
      if (!cart) return next(new AppError("Cart is not found", 404))
      let totalOrderPrice = cart.totalCartPrice || cart.totalCartPriceAfterDiscount
      let order = new Order({
        user: user._id,
        orderItems: cart.cartItems,
        shippingAddress: checkout.metadata,
        totalOrderPrice: checkout.amount_total / 100,
        paymentType: "card",
        isPaid: true,
      })
      await order.save()

      // for (let i = 0; i < order.orderItems.length; i++) {
      //     let product = await Product.findById(order.orderItems[i].product)
      //     product.soldItems += order.orderItems[i].quantity
      //     product.stock -= order.orderItems[i].quantity
      //     product.save()

      // }
      let options = cart.cartItems.map((prod) => {
        return {
          updateMany: {
            filter: { _id: prod.product },
            update: {
              $inc: { soldItems: prod.quantity, stock: -prod.quantity },
            },
          },
        }
      })

      await Product.bulkWrite(options)
      await Cart.deleteOne({ _id: cart._id })
    }
    res.json({ message: "Success", data: checkout })
  })
)
//=======
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))
//-------------Contact us
let contactMessages = []

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abdelrhmanahmed23i8@gmail.com",
    pass: "mdpj otvt lous npag",
  },
})

app.get("/api/contact/messages", protect, allowedTo("admin"), (req, res) => {
  res.status(200).json(contactMessages)
})

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" })
  }

  contactMessages.push({
    id: contactMessages.length + 1,
    name,
    email,
    message,
    date: new Date(),
  })

  // Send an email with the form data
  const mailOptions = {
    from: email,
    to: "abdelrhmanahmed23i8@gmail.com",
    subject: `New Contact Form Submission from ${name}`,
    text: `You have a new contact form submission:
        
        Name: ${name}
        Email: ${email}
        Message: ${message}`,
  }

  // Send email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error)
      return res.status(500).json({ error: "Failed to send message. Please try again later." })
    }

    console.log("Email sent:", info.response)
    res.status(200).json({ success: true, message: "Your message has been sent via email!" })
  })
})

//-----
app.get("/", (req, res) => res.send("Hello World!"))
bootstrap(app)

app.use("*", (req, res, next) => {
  next(new AppError(`route is not found:${req.originalUrl}`))
})

app.use(globalErrorHandler)

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection error:", err)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
