import webhookLog from "../model/webhookCreationModel.js";
/**
 * Insertion of Webhook Log
 * @param  [type] order       [obj]
 * @param  [type] currentShop [string]
 * @param  [type] hook_type   [obj]
 * @return [type]             [void]
 */
//insert on webhook fulfillment
export default async function insertWebhookCreation(session, topic, status, response) {
  
  let webhookData = new webhookLog({
    topic: topic,
    shop_id: session.shop_id,
    status: status,
    shop_name : session.shop,
    response : response,
    created_at: new Date(),
  });

  //validation
  try {
    console.log("webhook data inserted succesfully");
    webhookData.save();
  } catch (error) {
    console.log(error);
  }
}
