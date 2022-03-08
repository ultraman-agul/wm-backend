import express from "express";
import Location from "../controller/v1/location.js";
import Restaurant from "../controller/v1/restaurant.js";

const router = express.Router();

router.get("/location", Location.location); // 获取当前位置
router.get("/location_search", Location.locationSearch); // 返回多个搜索地址结果，用于搜索建议

router.get("/all_restaurant", Restaurant.allRestaurant);
export default router;
