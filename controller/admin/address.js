import BaseClass from "../../prototype/baseClass.js";
import AddressModel from "../../models/address.js";
import OrderModel from "../../models/order.js";
class Address extends BaseClass {
  constructor() {
    super();
  }
  //获取用户所有收货地址
  async getAllAddress(req, res, next) {
    try {
      let address = await AddressModel.find({ user_id: req.user.user_id });
      res.send({
        status: 200,
        address: address,
        message: "获取地址成功",
      });
    } catch (err) {
      console.log("获取收货地址失败", err);
      res.send({
        status: -1,
        message: "获取收货地址失败",
      });
    }
  }

  addAddress = async (req, res, next) => {
    const data = req.body;
    console.log(data);
    const { name, phone, address, gender, lng, lat, house_number } = data;
    if (
      !name ||
      !phone ||
      !address ||
      !gender ||
      !house_number ||
      !lng ||
      !lat
    ) {
      res.send({
        status: "-1",
        message: "新增地址失败",
      });
      return;
    }
    try {
      const address_id = await this.getId("address_id");
      const insertData = {
        ...data,
        user_id: req.user.user_id,
        id: address_id,
      };
      const address = await new AddressModel(insertData).save();
      res.send({
        status: 200,
        address,
        message: "新增收货地址成功",
      });
    } catch (e) {
      console.log(e);
      res.send({
        status: -1,
        message: "新增收货地址失败",
      });
    }
  };

  // 获取商家下的订单用户地址
  getAddress = async (req, res, next) => {
    try {
      let data = [];
      const { restaurant_id } = req.query;
      if (restaurant_id) {
        data = await OrderModel.find({ restaurant_id }).populate([
          { path: "address" },
        ]);
        data = data.map((item) => item.address);
      } else {
        data = await AddressModel.find();
      }
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
}

export default new Address();
