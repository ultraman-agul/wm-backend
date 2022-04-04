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

  //根据id获取指定餐馆信息
  async getRestaurantById(req, res, next) {
    const id = req.params.id;
    if (!id) {
      res.send({
        status: -1,
        message: "获取指定餐馆失败，参数有误",
      });
      return;
    }
    try {
      let restaurant_data = await RestaurantModel.findOne({ id: id }, "-_id");
      res.send({
        status: 200,
        message: "获取指定餐馆信息成功",
        data: restaurant_data,
      });
    } catch (err) {
      res.send({
        status: -1,
        message: "获取指定餐馆失败",
      });
    }
  }

  // 获取全部餐馆 不需要定位
  allRestaurantNoLoc = async (req, res, next) => {
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

  // 获取用户是否已经注册了店铺，一个用户只能有一家
  getHasShop = async (req, res, next) => {
    try {
      let restaurants = ""; //餐馆信息
      restaurants = await RestaurantModel.findOne(
        { user_id: req.user.user_id },
        "-_id"
      );
      if (restaurants) {
        res.send({
          status: 200,
          message: "已存在商店",
          data: restaurants,
        });
      } else {
        res.send({
          status: 200,
          message: "未注册商店",
          data: false,
        });
      }
    } catch (err) {
      res.send({
        status: -1,
        message: "判断是否拥有商店失败",
      });
    }
  };

  // 创建商店
  createShop = async (req, res, next) => {
    try {
      const {
        shipping_fee,
        lat,
        lng,
        pic_url,
        name,
        classify,
        call_center,
        address,
        start_time,
        end_time,
        min_price,
        activities,
      } = req.body;
      const discounts2 = [];
      const discountPic = [
        "http://p0.meituan.net/xianfu/f8bc8dffdbc805878aa3801a33f563cd1001.png",
        "http://p1.meituan.net/xianfu/9c997ecce6150671b8459738a26f8bd9767.png",
        "http://p0.meituan.net/xianfu/019d1bbb1310b1531e6af6172c9a5095581.png",
      ];
      activities.forEach((item, index) => {
        discounts2.push({
          promotion_type: 2,
          icon_url: discountPic[index] ?? "",
          info: item.value,
        });
      });
      const id = await this.getId("restaurant_id");
      const data = {
        id,
        user_id: req.user.user_id,
        shipping_fee,
        lat,
        lng,
        pic_url,
        name,
        third_category: classify,
        call_center,
        address,
        start_time,
        end_time,
        min_price,
        discounts2,
        month_sales: 0,
        month_sales_tip: 0,
        wm_poi_score: 0,
        delivery_score: 0,
        quality_score: 0,
        pack_score: 0,
        food_score: 0,
        comment_number: 0,
      };
      const shop = new RestaurantModel(data);
      await shop.save();
      res.send({
        status: 200,
        message: "创建商店成功!",
        data: shop,
      });
    } catch (e) {
      console.log(e);
      res.send({
        status: -1,
        message: "创建商店失败!",
      });
    }
  };
}

export default new Restaurant();
