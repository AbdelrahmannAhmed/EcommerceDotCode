import Mongoose from "mongoose"

export const dbConnection = Mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log("database connected successfully")
  })
  .catch((err) => {
    console.log(err)
  })
