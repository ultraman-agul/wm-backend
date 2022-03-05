import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: String,
  password: String,
  id: Number,
  status: Number, //1:普通用户、 2:普通管理员 3：超级管理员
  create_time: {
    type: Date,
    default: new Date(),
  }, //创建日期
  avatar: { type: String, default: "default.jpg" }, //头像图片
  city: String, //城市
});

adminSchema.index({ id: 1 }); // id作为索引

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
