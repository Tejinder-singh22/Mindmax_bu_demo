
import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/Mindmax_demo',
{
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true
}
);

const db = mongoose.connection;
export default db;