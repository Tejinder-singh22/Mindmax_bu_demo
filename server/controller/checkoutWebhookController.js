
import insertCheckoutOrder from "../Dao/insertCheckoutOrder.js";
/**
 * Controller contains logic for checkout (webhook);
 * @param  [type] $currentShop       [string]
 * @param  [type] $order             [object]
 * @return [type]                    [void]
 */
//STEP-4
export default function orderWebhookController(currentShop, order, shopId) {
  if (currentShop != null && order != null) {
    console.log(shopId +' checkout-2');
    insertCheckoutOrder(order, currentShop, shopId);
  }
}
