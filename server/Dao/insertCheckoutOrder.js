import OrderCheckout from "../model/ordersCheckoutModel.js";
/**
 * Insertion of checkout order
 * @param  [type] order       [description]
 * @param  [type] currentShop [description]
 * @return [type]             [void]
 */
export default async function insertFulfilled(order, currentShop,current_shopId) {
  console.log(typeof current_shopId+ 'checkout-3');
  let myorder = new OrderCheckout({
    checkout_id: order.id,
    shop_id: current_shopId,
    checkout_token: order.token,
    shop_name: currentShop,
    cart_token: order.cart_token,
    checkout_order_data: order,
    created_at: order.created_at,
  });

   //validation
   const user = await OrderCheckout.findOne({ checkout_id: order.id });
   if (user) {
    OrderCheckout.findOneAndUpdate(
       { checkout_id: order.id },
       {
        created_at: order.created_at,
       },
       { new: true },
       (error, data) => {
         if (error) {
           console.log(error);
         } else {
           console.log("checkout data updated successfully");
         }
       }
     );
   } else {
     try {
      console.log("checkout order inserted succesfully");
       // console.log(Student);
       myorder.save();
     } catch (error) {
       console.log(error);
     }
   }
}
