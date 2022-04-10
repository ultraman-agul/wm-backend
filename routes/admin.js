import express from "express";
import Admin from "../controller/admin/admin.js";

const router = express.Router();
router.post("/user_login", Admin.userLogin);
router.post("/add_user", Admin.addUser); // 新增用户
router.post("/editUser", Admin.editUser); // 新增用户
router.get("/deleteUser", Admin.deleteUser);
router.post("/change_avatar", Admin.changeAvatar);
router.get("/user_info", Admin.userInfo);
router.get("/all_user_info", Admin.getAllUserInfo);
export default router;
