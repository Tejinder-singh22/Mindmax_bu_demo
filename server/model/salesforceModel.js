
 
import mongoose  from "mongoose";
const salesforceSchema = new mongoose.Schema({
  client_id :{
    type: String,
    required: true,
  },
  shop_id: {
    type: mongoose.Schema.ObjectId,
    ref: "shopSchema", 
    // required: [true, 'required shopid']
  },
  shop_name: {
    type: String,
    required: true
  },
  client_secret: {
    type: String
  },
  // unique_secret_token: {
  //    type: String
  // },
  username: {
    type: String,
    required: true
  },
  grant_type: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  token_api_url: {
    type: String,
    required: true
  },
  contact_api_url: {
    type: String
  },
  opportunity_api_url: {
    type: String,
    required: true
  },
  opportunity_contact_role:{
    type: String,
    required: true
  },
  opportunity_line_item:{
    type: String,
    required: true
  },
  query_api_url:{
    type: String,
    required: true
  },
  created_at: {
    type: Date
  },
  updated_at:{
    type: Date
  }

}, {collection: 'salesforce_credentials'})

const Salesforce = mongoose.model("salesforceSchema", salesforceSchema)

export default Salesforce;
 