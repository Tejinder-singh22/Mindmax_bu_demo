import storeLog from "../model/storeLogModel.js";
/**
 * inserting store logs getting from salesforce;
 * @param  [type] order         [object]
 * @param  [type] currentShop   [string]
 * @return [type]               [void]
 */
export default async function insertStoreLog(
  logType,
  shop_id,
  logError,
  name,
  orderJson,
  currentShop,
) {
  let log = new storeLog({
    log_type: logType,
    shop_id, shop_id,
    log_error: logError,
    order_id: name,
    order_json: orderJson,
    shop_name: currentShop,
    created_at: new Date(),
  });

  //validation
  try {
    log.save();
    console.log("Log inserted succesfully");
  } catch (error) {
    console.log(error);
  }
}
