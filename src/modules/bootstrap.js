import { authRouter } from "./auth/auth.routes.js"
import { cartRouter } from "./cart/cart.routes.js"
import { categoryRouter } from "./category/category.routes.js"
import { orderRouter } from "./order/order.routes.js"
import { productRouter } from "./product/product.routes.js"
import { subCategoryRouter } from "./subCategories/subCategory.routes.js"
import { userRouter } from "./users/user.routes.js"
import { wishlistRouter } from "./wishlist/wishlistRoute.js"

export const bootstrap = (app) => {
  app.use("/api/product", productRouter)
  app.use("/api/user", userRouter)
  app.use("/api/auth", authRouter)
  app.use("/api/category", categoryRouter)
  app.use("/api/subcategory", subCategoryRouter)
  app.use("/api/cart", cartRouter)
  app.use("/api/order", orderRouter)
  app.use("/api/wishlist", wishlistRouter)
}
