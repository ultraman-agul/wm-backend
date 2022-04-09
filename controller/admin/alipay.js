import alipaySdk from "../../utils/alipay.js";
import AlipayFormData from "alipay-sdk/lib/form.js"; // alipay.trade.page.pay 返回的内容为 Form 表单
import config from "../../config.js";
import OrderModel from "../../models/order.js";
import RestaurantModel from "../../models/restaurant.js";
import FoodModel from "../../models/food.js";
class Pay {
  alipay = async (req, res, next) => {
    const formData = new AlipayFormData.default();
    formData.setMethod("get");
    // 通过 addField 增加参数
    // 在用户支付完成之后，支付宝服务器会根据传入的 notify_url，以 POST 请求的形式将支付结果作为参数通知到商户系统。
    // formData.addField("notifyUrl", "http://www.baidu.com/"); // 支付成功回调地址，必须为可以直接访问的地址，不能带参数
    formData.addField("bizContent", {
      outTradeNo: req.body.id, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
      productCode: "FAST_INSTANT_TRADE_PAY", // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
      totalAmount: "0.01", // 订单总金额，单位为元，精确到小数点后两位
      subject: "商品", // 订单标题
      body: "商品详情", // 订单描述
    }); // 如果需要支付后跳转到商户界面，可以增加属性"returnUrl"
    // formData.addField("returnUrl", "https://opendocs.alipay.com");
    formData.addField(
      "returnUrl",
      `${config.Server_URL}/alipay/successPay?id=${req.body.id}`
    );
    const result = await alipaySdk.exec(
      "alipay.trade.page.pay", // 统一收单下单并支付页面接口
      {}, // api 请求的参数（包含“公共请求参数”和“业务参数”）
      { formData: formData }
    ); // result 为可以跳转到支付链接的 url
    res.send({
      status: 200,
      url: result,
    });
  };

  // 用户成功付款，修改订单状态
  successPay = async (req, res, next) => {
    try {
      const { id } = req.query;
      const data = await OrderModel.findOneAndUpdate(
        { id },
        { status: "已支付", code: 200 }
      );
      console.log(data);
      let count = 0;
      data.foods.forEach(async (item) => {
        count += item.num;
        await FoodModel.findOneAndUpdate(
          { _id: item._id },
          { $inc: { month_saled: item.num } }
        );
      });
      await RestaurantModel.findOneAndUpdate(
        { id: data.restaurant_id },
        { $inc: { month_sales: count } }
      );
      // res.send("<h2>支付成功</h2>");
      res.send({
        status: 200,
        message: "支付成功",
      });
    } catch (e) {
      console.log(e);
      res.send({
        status: -1,
        message: "支付失败",
      });
    }
  };
}

export default new Pay();
