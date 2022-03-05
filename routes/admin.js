import express from "express";
import Admin from "../controller/admin/admin.js";

const router = express.Router();
router.post("/add_user", Admin.addUser); // 新增用户
router.get("/test", Admin.test);
export default router;
