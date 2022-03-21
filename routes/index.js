import admin from "./admin.js";
import upload from "./upload.js";
import address from "./address.js";
import v1 from "./v1.js";
export default (app) => {
  app.use("/admin", admin); // 添加前缀，便于维护
  app.use("/upload", upload);
  app.use("/address", address);
  app.use("/v1", v1);
};
