
 
import mongoose  from "mongoose";
const storeLogSchema = new mongoose.Schema({
 log_type: {
    type: String
  },
  shop_id: {
    type: mongoose.Schema.ObjectId,
    ref: "shopSchema", 
    required: [true, 'required shopid']
  },
  log_error: {
    type: Array,
    required: true,
  },
  order_id: {
    type: String,
  },
  shop_name:{
    type: String,
    required: true,
  },
  created_at: {
    type: Date
  }

}, {collection: 'log_table'})

const storeLog = mongoose.model("storeLogSchema", storeLogSchema)

export default storeLog;
 