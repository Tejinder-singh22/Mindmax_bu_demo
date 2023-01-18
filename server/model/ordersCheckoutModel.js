
 

import mongoose  from "mongoose";
const orderCheckoutSchema = new mongoose.Schema({
  checkout_id: {
    type: Number,
    required: true,
  },
  shop_id: {
    type: mongoose.Schema.ObjectId,
    ref: "shopSchema", 
    required: [true, 'required shopid']
  },
 checkout_token: {
    type: String
  },
  shop_name: {
    type: String,
    required: true,
  },
  cart_token: {
    type: String,
  }, 
  checkout_order_data: {
      type: Array,
  },
  created_at: {
    type: Date
  }

}, {collection: 'checkout_information'})

const OrderCheckout = mongoose.model("orderCheckoutSchema", orderCheckoutSchema)

export default OrderCheckout;
 