import { Shopify } from "@shopify/shopify-api";
import insertData from "../Dao/insert.js";
import insertSyncedOrders from "../Dao/insertSyncedOrders.js";
import getOrders from "../helpers/getOrders.js";
import webhookCreation from "../Dao/insertWebhookCreation.js";
import topLevelAuthRedirect from "../helpers/top-level-auth-redirect.js";
import createWebhook from "../webhooks/createWebhook.js";

export default function applyAuthMiddleware(app) {
  app.get("/auth", async (req, res) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      return res.redirect(
        `/auth/toplevel?${new URLSearchParams(req.query).toString()}`
      );
    }

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      "/auth/callback",
      app.get("use-online-tokens")
    );

    res.redirect(redirectUrl);
  });

  app.get("/auth/toplevel", (req, res) => {
    res.cookie(app.get("top-level-oauth-cookie"), "1", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res.set("Content-Type", "text/html");

    res.send(
      topLevelAuthRedirect({
        apiKey: Shopify.Context.API_KEY,
        hostName: Shopify.Context.HOST_NAME,
        host: req.query.host,
        query: req.query,
      })
    );
  });

  app.get("/auth/callback", async (req, res, next) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );

      const host = req.query.host;
      app.set(
        "active-shopify-shops",
        Object.assign(app.get("active-shopify-shops"), {
          [session.shop]: session.scope,
        })
      );

      const response = await Shopify.Webhooks.Registry.register({
        shop: session.shop,
        accessToken: session.accessToken,
        topic: "APP_UNINSTALLED",
        path: "/webhooks",
      });

      if (!response["APP_UNINSTALLED"].success) {
        console.log(
          `Failed to register APP_UNINSTALLED webhook: ${response.result}`
        );
      }

      process.env.TEMP_STORE = session.shop;
      console.log(session.shop + ' in auth 76');
      console.log(session.accessToken + 'our access token');

      insertData(session, host, process.env.SHOPIFY_API_KEY, next);
      // Sync orders on installation and insert
      try {
        const orderData = await getOrders(session);
        //  console.log(orderData+'orderData');
        const obj = JSON.parse(orderData);
        if (obj.orders) {
          obj.orders.forEach((element) => {
            console.log(element + 'we got in auth 87!!!');
            insertSyncedOrders(element, session, next);
          });
        }
      } catch (e) {
        throw new Error(e);
      }


       //STEP-2
      //@param
      // @session, @checkoutTopic, @checkoutUrl
      createWebhook(session, "orders/fulfilled", "ordersWebhook")
        .then((data) => {
         data = JSON.parse(data);
          if (data.webhook) {
            console.log("webhook for ORDER FULLFILMENT created " + data);
            webhookCreation(session, 'orders/fulfilled', true, data.webhook);
          }
          if (data.errors) {
            if ( data.errors.address && data.errors.address[0]== "for this topic has already been taken") {
              console.log('already created orders/fulfilled');
            } else webhookCreation(session, 'orders/fulfilled', false, data.errors);
          }
        }).catch((e) => { console.log(e.message); });

      createWebhook(session, "checkouts/create", "checkoutWebhook")
        .then((data) => {
           data = JSON.parse(data);
          if (data.webhook) {
            console.log("webhook for CHECKOUT CREATE created " + data);
            webhookCreation(session, 'checkouts/create', true, data.webhook);
          }
          if (data.errors) {
            if (data.errors.address && data.errors.address[0] == "for this topic has already been taken") {
              console.log('already created checkouts/create');
            } else   webhookCreation(session, 'checkouts/create', false, data.errors);
          }
        }).catch((e) => { console.log(e.message); });

      createWebhook(session, "app/uninstalled", "appUninstalledWebhook")
        .then((data) => {
          data = JSON.parse(data);
          if (data.webhook) {
            console.log("webhook for APP UININSTALL created " + data);
            webhookCreation(session, 'app/uninstalled', true, data.webhook);
          } if (data.errors) {
            if ( data.errors.address && data.errors.address[0] == "for this topic has already been taken") {
              console.log('already created app/uninstalled');
            } else  webhookCreation(session, 'app/uninstalled', false, data.errors);
          }
        }).catch((e) => { console.log(e.message); });

      // Redirect to app with shop parameter upon auth
      res.redirect(`/?shop=${session.shop}&host=${host}`);
    } catch (e) {
      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          res.redirect(`/auth?shop=${req.query.shop}`);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
}
