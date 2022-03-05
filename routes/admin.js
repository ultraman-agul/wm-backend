import express from "express";
import Admin from "../controller/admin/admin.js";

const router = express.Router();
router.post("/user_login", Admin.userLogin);
router.post("/add_user", Admin.addUser); // 新增用户
export default router;
