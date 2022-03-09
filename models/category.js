import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  id: Number,
  restaurant_id: Number, //餐馆id
  name: String,
  icon: String, //icon 图片地址
  spus: [{ type: Schema.ObjectId, ref: "Food" }], // 关联食品表的数据
  created_at: { type: Date, default: new Date() },
});

export default mongoose.model("Category", categorySchema);
