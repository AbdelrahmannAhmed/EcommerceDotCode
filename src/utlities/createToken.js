import pkg from "jsonwebtoken"
const { sign } = pkg

const createToken = (payload) =>
  sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

export default createToken
