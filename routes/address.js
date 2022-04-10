import express from "express";
import Address from "../controller/admin/address.js";

const router = express.Router();
router.get("/get_all_address", Address.getAllAddress); // 获取用户所有地址
router.get("/getAddress", Address.getAddress); // 获取系统中所有地址
router.post("/addAddress", Address.addAddress);
export default router;
