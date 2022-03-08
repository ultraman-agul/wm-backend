import BaseClass from "../../prototype/baseClass.js";
import RestaurantModel from "../../models/restaurant.js";

class Restaurant extends BaseClass {
  constructor() {
    super();
  }

  // 获取全部餐馆
  allRestaurant = async (req, res, next) => {
    try {
      let restaurants = ""; //餐馆信息
      restaurants = await RestaurantModel.find({}, "-_id");
      res.send({
        status: 200,
        message: "获取全部餐馆列表成功",
        data: restaurants,
      });
    } catch (err) {
      console.log("获取餐馆列表失败", err);
      res.send({
        status: -1,
        message: "获取餐馆失败",
      });
    }
  };
}

export default new Restaurant();
