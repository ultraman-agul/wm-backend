import express from "express";
import Admin from "../controller/admin/admin.js";

const router = express.Router();
router.post("/user_login", Admin.userLogin);
router.post("/add_user", Admin.addUser); // 新增用户
router.get("/get_all_address", Admin.getAllAddress); // 获取用户所有地址
router.post("/change_avatar", Admin.changeAvatar);
router.get("/user_info", Admin.userInfo);
router.get("/all_user_info", Admin.getAllUserInfo);
export default router;
