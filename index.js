import config from "./config.js";
import "./mongodb/db.js";
import express from "express";
import path from "path";
const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.send("连接成功");
});
app.listen(config.PORT, () => {
  console.log(`服务器正在运行，端口:${config.PORT}`);
});
