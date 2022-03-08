import BaseClass from "../../prototype/baseClass.js";
import RestaurantModel from "../../models/restaurant.js";
import config from "../../config.js";
class Restaurant extends BaseClass {
  constructor() {
    super();
  }

  // 获取全部餐馆
  allRestaurant = async (req, res, next) => {
    const { lat, lng } = req.query;
    try {
      let restaurants = ""; //餐馆信息
      restaurants = await RestaurantModel.find({}, "-_id");
      await this.getDistance(restaurants, lat, lng);
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

  //获取餐馆时计算距离以及驾车时间
  async getDistance(restaurants, lat, lng) {
    for (let i = 0; i < restaurants.length; i++) {
      let result = null;
      result = await this.fetch(
        "https://apis.map.qq.com/ws/distance/v1/matrix",
        {
          mode: "driving",
          from: `${lat},${lng}`,
          to: `${restaurants[i].lat},${restaurants[i].lng}`,
          key: config.tencentkey,
        }
      );

      if (result.status !== 0) {
        //请求出错时  设置给假数据
        restaurants[i].distance = "10km";
        restaurants[i].delivery_time_tip = "50分钟";
      } else {
        let element = result.result.rows[0].elements[0];
        restaurants[i].distance = (element.distance / 1000).toFixed(1) + "km"; //计算距离
        restaurants[i].delivery_time_tip =
          (element.duration / 60).toFixed(1) + "分钟";
      }
    }
    return restaurants;
  }
}

export default new Restaurant();
