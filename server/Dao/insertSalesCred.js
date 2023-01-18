import SalesCred from "../model/salesforceModel.js";
/**
 * Insertion of checkout order
 * @param  [type] order       [description]
 * @param  [type] currentShop [description]
 * @return [type]             [void]
 */
export default async function insertSalesCred(creds, shopId, currentShop) {
  
  let salesCred = new SalesCred({
    client_id: creds.client_id,
    shop_id: shopId,
    shop_name: currentShop,
    client_secret: creds.client_secret,
    username: creds.username,
    grant_type: creds.grant_type,
    refresh_token: creds.refresh_token,
    token_api_url: creds.token_api_url,
    contact_api_url: creds.contact_api_url,
    opportunity_api_url:  creds.opportunity_api_url,
    opportunity_contact_role:  creds.opportunity_contact_role,
    opportunity_line_item:  creds.opportunity_line_item,
    query_api_url: creds.query_api_url,
    created_at: new Date(),
    updated_at: new Date()
  });


  const user = await SalesCred.findOne({ shop_id: shopId });
  if (user) {
    SalesCred.findOneAndUpdate(
      { shop_id: shopId, },
      {
        client_secret: creds.client_secret,
        grant_type: creds.grant_type,
        refresh_token: creds.refresh_token,
        token_api_url: creds.token_api_url,
        contact_api_url: creds.contact_api_url,
        opportunity_api_url:  creds.opportunity_api_url,
        opportunity_contact_role:  creds.opportunity_contact_role,
        opportunity_line_item:  creds.opportunity_line_item,
        updated_at: new Date(),
      },
      { new: true },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Salesforce cred updated successfully");
          console.log(data);
        }
      }
    );
  } else {
    try {
      console.log("Salesforce cred inserted succesfully");
      // console.log(Student);
      salesCred.save();
    } catch (error) {
      console.log(error);
    }
  }
}
