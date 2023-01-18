
import mongoose  from "mongoose";
const webhookCreationSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  shop_id: {
    type: mongoose.Schema.ObjectId,
    ref: "shopSchema" 
  },
  status: {
    type: Boolean,
    required: true,
  },
  shop_name: {
    type: String,
    required: true,
  },
  response:{
    type: Array,
  },
  created_at: {
    type: Date
  }

}, {collection: 'webhook_creation'})

const webhookCreation = mongoose.model("webhookCreationSchema", webhookCreationSchema)

export default webhookCreation;
 