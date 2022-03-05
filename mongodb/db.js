import config from "../config.js";
import mongoose from "mongoose";
mongoose.connect(config.DB_URL); // 连接数据库

// connection 对象后续用于创建和检索 models。 models 的范围总是局限于单个连接。
// 调用 mongoose.connect() 时，Mongoose 会自动创建默认连接。 可以使用 mongoose.connection 访问默认连接
const db = mongoose.connection;

db.once("open", () => {
  console.log("连接数据库成功！");
});

db.on("error", (err) => {
  console.error("连接数据库失败:" + err);
});

db.on("close", function () {
  console.log("数据库连接中断，正在尝试重新连接");
  mongoose.connect(config.DB_URL);
});

export default db;
