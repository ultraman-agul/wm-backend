import BaseClass from "../../prototype/baseClass.js";
import OrderModel from "../../models/order.js";
import RestaurantModel from "../../models/restaurant.js";
import AdminModel from "../../models/admin.js";
import AddressModel from "../../models/address.js";
import FoodsModel from "../../models/food.js";
import moment from "moment";
class Order extends BaseClass {
  constructor() {
    super();
  }
  //下订单
  makeOrder = async (req, res, next) => {
    let { restaurant_id, foods, address_id } = req.body;
    if (!restaurant_id && !foods && !address_id) {
      res.send({
        status: -1,
        message: "下订单失败，参数有误",
      });
      return;
    }
    try {
      let pArr = [];
      let restaurant = await RestaurantModel.findOne({ id: restaurant_id }); // 找到该餐馆
      pArr.push(this._calcTotalPrice(restaurant.shipping_fee, foods)); // 计算总价格
      pArr.push(AddressModel.findOne({ id: address_id })); // 地址信息
      pArr.push(AdminModel.findOne({ id: req.user.user_id })); // 用户信息
      pArr.push(this.getId("order_id")); //订单号
      Promise.all(pArr).then(async (values) => {
        let order_data = {
          total_price: values[0].total_price,
          foods: values[0].order_foods,
          address: values[1]._id,
          user_id: values[2]._id,
          id: values[3],
          restaurant_id,
          status: "未支付",
          code: 0,
          restaurant: restaurant._id,
          shipping_fee: restaurant.shipping_fee,
          create_time_timestamp: Math.floor(new Date().getTime() / 1000),
        };
        let order = new OrderModel(order_data);
        await order.save();
        res.send({
          status: 200,
          message: "提交订单成功，请尽快支付",
          order_id: values[3],
          total_price: values[0].total_price,
        });
      });
    } catch (err) {
      console.log("提交订单失败", err);
      res.send({
        status: -1,
        message: "提交订单失败",
      });
    }
  };

  //计算总价格
  _calcTotalPrice = async (shipping_fee, foods) => {
    let total_price = 0,
      order_foods = [];
    for (let i = 0; i < foods.length; i++) {
      let food = await FoodsModel.findOne({ "skus.id": foods[i]["skus_id"] }); //根据sku_id找到food
      let sku = food.skus.filter((sku) => {
        return sku.id == foods[i]["skus_id"];
      });

      order_foods.push({
        name: food["name"],
        price: sku[0]["price"],
        num: foods[i]["num"],
        total_price: Number(sku[0].price) * Number(foods[i]["num"]),
        spec: sku[0]["spec"] || "",
        pic_url: food["pic_url"],
      });
      total_price += Number(sku[0].price) * Number(foods[i]["num"]).toFixed(2);
    }
    total_price += shipping_fee ? shipping_fee : 0;
    return { total_price, order_foods };
  };

  // 获取用户的订单列表,可分页
  getOrder = async (req, res, next) => {
    let { offset = 0, limit = 10 } = req.query;
    try {
      let userInfo = await AdminModel.findOne({ id: req.user.user_id });
      console.log(userInfo);
      let orders = await OrderModel.find(
        {
          //   code: 200,
          user_id: userInfo._id,
        },
        "-_id"
      )
        .populate([{ path: "restaurant" }, { path: "address" }])
        .limit(Number(limit))
        .sort({ create_time_timestamp: -1 })
        .skip(Number(offset));
      res.send({
        status: 200,
        data: orders,
        message: "获取我的订单列表成功",
      });
    } catch (err) {
      console.log("获取订单列表失败", err);
      res.send({
        status: -1,
        message: "获取订单列表失败",
      });
    }
  };

  // 获取商家的订单列表,可分页
  getOrderByRestaurantId = async (req, res, next) => {
    let { offset = 0, limit = 10, restaurant_id } = req.query;
    try {
      let orders = await OrderModel.find(
        {
          restaurant_id,
        },
        "-_id"
      )
        .populate([{ path: "restaurant" }, { path: "address" }])
        .limit(Number(limit))
        .sort({ create_time_timestamp: -1 })
        .skip(Number(offset));

      let allData = await OrderModel.find({ restaurant_id }, "-_id");
      res.send({
        status: 200,
        data: orders,
        totalNum: allData.length,
        message: "获取我的订单列表成功",
      });
    } catch (err) {
      console.log("获取订单列表失败", err);
      res.send({
        status: -1,
        message: "获取订单列表失败",
      });
    }
  };

  // 获取商家今日的订单列表,可分页
  getTodayOrderByRestaurantId = async (req, res, next) => {
    let { offset = 0, limit = 10, restaurant_id } = req.query;
    try {
      let orders = await OrderModel.find(
        {
          restaurant_id,
          create_time_timestamp: { $gte: moment().startOf("day").format("X") }, // 获取时间大于今日凌晨
        },
        "-_id"
      )
        .populate([{ path: "restaurant" }, { path: "address" }])
        .limit(Number(limit))
        .sort({ create_time_timestamp: -1 })
        .skip(Number(offset));

      let allData = await OrderModel.find({ restaurant_id }, "-_id");
      res.send({
        status: 200,
        data: orders,
        totalNum: allData.length,
        message: "获取我的订单列表成功",
      });
    } catch (err) {
      console.log("获取订单列表失败", err);
      res.send({
        status: -1,
        message: "获取订单列表失败",
      });
    }
  };

  orderInfo = async (req, res, next) => {
    const { order_id: id } = req.query;
    console.log(id);
    try {
      const data = await OrderModel.findOne({ id }, "-_id").populate([
        { path: "restaurant" },
        { path: "address" },
      ]);
      res.send({
        status: 200,
        data,
      });
      console.log(data);
    } catch {
      res.send({
        status: -1,
        message: "获取订单详情失败",
      });
    }
  };

  orderGroupByDay = async (req, res, next) => {
    const { restaurant_id } = req.query;
    console.log(restaurant_id);
    try {
      const data = await OrderModel.aggregate([
        { $match: { restaurant_id: Number(restaurant_id) } },
        { $project: { day: { $substr: ["$create_time", 0, 10] } } },
        { $group: { _id: "$day", number: { $sum: 1 } } },
        { $sort: { _id: -1 } },
      ]);
      res.send({
        status: 200,
        data,
      });
    } catch (e) {
      console.log(e);
      res.send({
        status: -1,
      });
    }
  };

  // 统计用户、商家、订单数量
  getCounts = async (req, res, next) => {
    try {
      const userNum = await AdminModel.count();
      const restaurantNum = await RestaurantModel.count();
      const orderNum = await OrderModel.count();
      res.send({
        status: 200,
        data: {
          userNum,
          restaurantNum,
          orderNum,
        },
      });
    } catch (e) {
      console.log(e);
      res.send({
        status: -1,
      });
    }
  };

  getAllOrder = async (req, res, next) => {
    let { offset = 0, limit = 10 } = req.query;
    try {
      let orders = await OrderModel.find({}, "-_id")
        .populate([{ path: "restaurant" }, { path: "address" }])
        .limit(Number(limit))
        .sort({ create_time_timestamp: -1 })
        .skip(Number(offset));

      let count = await OrderModel.count();
      res.send({
        status: 200,
        data: orders,
        totalNum: count,
        message: "获取我的订单列表成功",
      });
    } catch (err) {
      console.log("获取订单列表失败", err);
      res.send({
        status: -1,
        message: "获取订单列表失败",
      });
    }
  };

  getTodayOrder = async (req, res, next) => {
    let { offset = 0, limit = 10 } = req.query;
    try {
      let orders = await OrderModel.find(
        {
          create_time_timestamp: { $gte: moment().startOf("day").format("X") }, // 获取时间大于今日凌晨
        },
        "-_id"
      )
        .populate([{ path: "restaurant" }, { path: "address" }])
        .limit(Number(limit))
        .sort({ create_time_timestamp: -1 })
        .skip(Number(offset));

      let allData = await OrderModel.count();
      res.send({
        status: 200,
        data: orders,
        totalNum: allData,
        message: "获取我的订单列表成功",
      });
    } catch (err) {
      console.log("获取订单列表失败", err);
      res.send({
        status: -1,
        message: "获取订单列表失败",
      });
    }
  };
}

export default new Order();
