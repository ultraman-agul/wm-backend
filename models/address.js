import mongoose from "mongoose";

const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: String,
  id: Number,
  phone: String,
  user_id: Number,
  created_at: { type: Date, default: Date.now() },
  address: String,
  address_detail: String,
  gender: Number, // 1先生 2女士
  province: String,
  city: String,
  title: String,
  district: String,
  lng: String,
  lat: String,
  house_number: String, //门牌号
});

addressSchema.index({ id: 1 });

const Address = mongoose.model("Address", addressSchema);

export default Address;
