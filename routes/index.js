import admin from "./admin.js";

export default (app) => {
  app.use("/admin", admin); // 添加前缀，便于维护
};
