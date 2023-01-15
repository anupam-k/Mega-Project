import Product from "../models/product.schema.js";
import Coupon from "../models/coupon.schema.js";
import Order from "../models/order.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import razorpay from "../config/razorpay.config.js";

/*************************************************************************
 * @GENERATE_RAZORPAY_ID
 * @route https://localhost:5000/api/order/razorpay
 * @description Controller used for generating razorpay Id
 * @description Creates a Razorpay Id which is used for placing order
 * @returns Order Object with "razorpay order id generated successfully"
 **************************************************************************/

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
  //get product and coupon from frontend

  //verify product price from backend
  //make DB query to get all products and info

  let totalAmount;
  //total amount and final amount
  // coupon check - DB
  // discount
  // finalAmount = totalAmount - discount

  const options = {
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${new Date().getTime()}`,
  };

  const order = await razorpay.orders.create(options);

  //if order does not exist
  //success then, send it to frontend
});
