import SalesforceModel from "../model/salesforceModel.js";

/**
 * Getting shop data by matching shop from DB;
 * @param  [type] currentShop           [string]
 * @return [type]                       [promise]
 */

export default async function getSalesforceCred(currentShop) {
  try {
    var data = await SalesforceModel.findOne({ shop_name: currentShop });
  } catch (error) {
    console.log(error);
  }

  return new Promise(function (resolve, reject) {
    if (data) {
      console.log("Fetch sales credentials");
      resolve(data);
    } else {
      reject(`cannot sales credentials`);
    }
  });
}
