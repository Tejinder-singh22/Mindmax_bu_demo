import Shop from "../model/shopsModel.js";
import ErrorHander from "../utils/errorHandler.js";
/**
 * insert app data of current store in mongo db
 * @param  [type] session               [obj]
 * @param  [type] host                  [string]
 * @param  [type] apiKey                [string]
 * @return [type]                       [promise void]
 */
export default async function insertData(session, host, apiKey, next) {
  let myshop = new Shop({
    shop_name: session.shop,
    client_id: apiKey,
    app_status: true,
    access_token: session.accessToken,
    host: host,
    shop_id: session.id,
    shop_state: session.state,
    isOnline: session.isOnline,
    scope: session.scope,
    expires: session.expires,
    access_expire: session.onlineAccessInfo.expires_in,
    user_scope: session.onlineAccessInfo.associated_user_scope,
    session: session.onlineAccessInfo.session,
    account_number: session.onlineAccessInfo.account_number,
    associated_id: session.onlineAccessInfo.associated_user.id,
    associated_email: session.onlineAccessInfo.associated_user.email,
    associated_account_owner:
      session.onlineAccessInfo.associated_user.account_owner,
    associated_email_verified:
      session.onlineAccessInfo.associated_user.email_verified,
    created_at: new Date(),
  });

  //validation
  try {
    var user = await Shop.findOne({ shop_name: session.shop },{"shop_name":1});
    if(user){
    session['shop_id'] = user._id;
    console.log('finding')
    }
  } catch (error) {
    return next(new ErrorHander(error));
  }

  if (user) {
    console.log('updating');
    Shop.findOneAndUpdate(
      { shop_name: session.shop },
      {
        app_status: true,
        access_token: session.accessToken,
        host: host,
        shop_id: session.id,
        shop_state: session.state,
        isOnline: session.isOnline,
        scope: session.scope,
        expires: session.expires,
        access_expire: session.onlineAccessInfo.expires_in,
        user_scope: session.onlineAccessInfo.associated_user_scope,
        session: session.onlineAccessInfo.session,
        account_number: session.onlineAccessInfo.account_number,
        associated_id: session.onlineAccessInfo.associated_user.id,
        associated_email: session.onlineAccessInfo.associated_user.email,
        associated_account_owner:
          session.onlineAccessInfo.associated_user.account_owner,
        associated_email_verified:
          session.onlineAccessInfo.associated_user.email_verified,
      },
      { new: true },
      (error, data) => {
        if (error) {
          return next(new ErrorHander(error));
        } else {
          console.log("app status updated successfully");
         
        }
      }
    );
  } else {
    try {
      console.log("data inserted succesfully");
      session['shop_id'] = myshop._id;
      myshop.save();
    } catch (error) {
      return next(new ErrorHander(error));
    }
  }
}
