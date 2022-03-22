import BaseClass from "../../prototype/baseClass.js";
import OrderModel from "../../models/order.js";
import RestaurantModel from "../../models/restaurant.js";
import AdminModel from "../../models/admin.js";
import AddressModel from "../../models/address.js";
import FoodsModel from "../../models/food.js";

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
}

export default new Order();