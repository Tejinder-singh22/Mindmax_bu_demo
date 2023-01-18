import Order from "../model/ordersModel.js";
import ErrorHander from "../utils/errorHandler.js";
/**
 * Insertion of orders from store to our db
 * @param  [type] order       [obj]
 * @param  [type] currentShop [string]
 * @return [type]             [void]
 */
//insert on app installation
export default async function insertOrders(order, session, next) {
  let myorder = new Order({
    order_id: order.id,
    shop_id: session.shop_id,
    first_name: order.billing_address.first_name,
    fulfillment_status: order.fulfillment_status,
    shop_name: session.shop,
    order_data: order,
    order_token: order.token,
    cart_token: order.cart_token,
    checkout_token: order.checkout_token,
    line_items: order.line_items,
    source_type: order.source_name,
    created_at: new Date(),
  });

  //validation
  try {
    var user = await Order.findOne({ order_id: order.id });
  } catch (error) {
    return next(new ErrorHander(error));
  }

  if (user) {
    console.log("shop name with this order already exists");
  } else {
    try {
      console.log("orders synced succesfully");
      myorder.save();
    } catch (error) {
        return next(new ErrorHander(error));
    }
  }
}
