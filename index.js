import config from "./config.js";
import "./mongodb/db.js";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import router from "./routes/index.js";
const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// all代表请求可以是get、post、options
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", "3.2.1");
  res.header("Cache-Control", "public,max-age=60000");
  // 任何请求之前有一个预请求，预请求后无其他回调处理，其他请求要进入下一个回调
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 对post请求类型的参数，按照这个格式去解析
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({}));
app.get("/", (req, res) => {
  res.send("连接成功");
});

router(app);

app.listen(config.PORT, () => {
  console.log(`服务器正在运行，端口:${config.PORT}`);
});
