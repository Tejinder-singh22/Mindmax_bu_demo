import express from "express";
const router = express.Router();
import ErrorHander from "../utils/errorHandler.js";
import formController from "../controller/formController.js";
import checkoutWebhookController from "../controller/checkoutWebhookController.js";
import orderWebhookController from "../controller/orderWebhookController.js";
import appUninstalledController from "../controller/appUninstalledController.js";
import insertSalesCred from "../Dao/insertSalesCred.js";
import getShopData from "../Dao/getShopData.js";
import listOrdersController from "../controller/listOrdersController.js";
import listStudentsController from "../controller/listStudentsController.js";
import listLogsController from "../controller/listLogsController.js";
/* hits on orderFulfillment*/
router.post("/ordersWebhook", async (req, res) => {
    console.log("🎉 We got an order!hjkkklkl");
    try {
      var order = req.body;
      console.log(order);
      let shopId = req.query.current_shop_id;
      console.log(shopId +' Order-1');
      orderWebhookController(order, req, shopId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


//STEP -3
/*hits on checkout webhook*/
router.post("/checkoutWebhook", async (req, res) => {
    console.log("🎉 Checkout order Triggered");
    try {
      const currentShop = req.query.shop;
      // console.log(req.body);
      const order = req.body;
      let shopId = req.query.current_shop_id;
      console.log(shopId +' checkout-1');
      checkoutWebhookController(currentShop, order, shopId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

    /* hits on app uninstallation */
router.post("/appUninstalledWebhook", async (req, res) => {
  console.log(req.body + 'appunistlallll******');
 if(req.session){ req.session.destroy(); }
  console.log("🎉 🎉 🎉APP UNINSTALLED SUCCESSFULLY");
  try {
    const currentShop = req.body.domain;
    appUninstalledController(currentShop);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/post_salesforce", async (req,res)=>{
    let sales_cred =  req.body
    console.log(JSON.stringify(sales_cred) + 'data');
    if(sales_cred){
      try {
      let shopData  = await getShopData("mindmax-bu-2.myshopify.com");
       insertSalesCred(sales_cred, shopData._id, "mindmax-bu-2.myshopify.com")
       }
       catch (err)
       {
        console.log(err);
       }
    res.sendStatus(200);
    }
    else
    res.status(500).send('Sales Data Undefined');
    

})



// @ts-ignore
/* hits on app loading from react*/
router.get("/listOrders", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const currentShop2 = req.query.shop;
  console.log(currentShop2 + " the thing we want ");
  listOrdersController(currentShop2).then(
    (data) => {
      // console.log(data + 'main data');
      res.send(data);
      return false;
    },
    (error) => {
      res.status(500).send(error.message);
    }
  );
});
/* hits on app loading from react*/
router.get("/listLogs", (req, res) => {
  const currentShop2 = req.query.shop;
  console.log(currentShop2 + " the thing we want ");
  listLogsController(currentShop2).then((result) => {
    // res.send(data);
    console.log(result + "logs");
    if (result != null) {
      res.json({
        msg: "success",
        status: 200,
        data: result,
      });
    } else {
      res.json({
        msg: "failed",
        status: 400,
        data: result,
      });
    }
    return false;
  });
});

/* hits on app loading from react*/
router.get("/listCustomers", (req, res) => {
  const currentShop2 = req.query.shop;
  console.log(currentShop2 + " the thing we want ");
  listStudentsController(currentShop2).then(
    (data) => {
      res.send(data);
      return false;
    },
    (error) => {
      res.status(500).send(error.message);
    }
  );
});

/* hits on checkout form*/
router.post("/demoApp", async function (req, res) {
    res.set("Access-Control-Allow-Origin", "*");
    const currentShop = req.query.shop;
    let shopData  = await getShopData(currentShop);
    // console.log(currentShop + " the thing we want at checkout demo app ");
    const Student = req.body;
    var result = formController(Student, currentShop, shopData._id);
    if (result != "failed") {
      res.json({
        msg: "success",
        status: 200,
        data: result,
      });
    } else {
      console.log("shop not found");
      res.json({
        msg: "shop / shopData not found",
        status: 404,
      });
    }
  });

export default router;
