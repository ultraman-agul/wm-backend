import admin from "./admin.js";
import upload from "./upload.js";
export default (app) => {
  app.use("/admin", admin); // 添加前缀，便于维护
  app.use("/upload", upload);
};
