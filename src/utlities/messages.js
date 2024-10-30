const generateMessage = (message) => ({
  addedSuccessfully: `${message} added successfully`,
  updatedSuccessfully: `${message} updated successfully`,
  deletedSuccessfully: `${message} deleted successfully`,
  successGet: `${message} get successfully`,
  notFound: `${message} not found`,
  alreadyExist: `${message} already exist`,
});

export const messages = {
  category: { ...generateMessage("Category") },
  product: { ...generateMessage("Product") },
  user: { ...generateMessage("User") },
  subCategory: { ...generateMessage("Sub Category") },
  brand: { ...generateMessage("Brand") },
  coupon: { ...generateMessage("Coupon") },
  review: { ...generateMessage("Review") },
  cart: { ...generateMessage("Cart") },
  order: { ...generateMessage("Order") },
};
