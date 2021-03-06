import BaseClass from "../../prototype/baseClass.js";
import AdminModel from "../../models/admin.js";
import crypto from "crypto";
class Admin extends BaseClass {
  constructor() {
    super();
  }

  //前台登录
  userLogin = async (req, res, next) => {
    let { username, password, status } = req.body;
    if (!status) {
      // 没有传status则是普通用户
      status = 1;
    }
    const md5password = this.encryption(password);
    try {
      let user = await AdminModel.findOne({ username, status });
      if (!user) {
        // 判断用户是否是超级管理员
        user = await AdminModel.findOne({ username, status: 3 });
        if (user && user.password === md5password) {
          this.setToken(user.id); //设置token
          return res.send({
            status: 200,
            message: "登录成功",
            username: user.username, //用户名
            avatar: user.avatar, //用户头像
            token: this.token,
          });
        }

        //因为前端没有写注册功能 所以这里如果用户输入的账号名是不存在的 就创建一个新的账号
        const user_id = await this.getId("user_id");
        // const cityInfo = await this.getLocation(req, res);
        const createData = {
          //创建一个新账号
          username, //用户名
          password: md5password, //用户密码
          id: user_id, //用户id
          status, //1为用户 2为商家
          //   city: cityInfo.city, //登录城市
          avatar: "http://i.waimai.meituan.com/static/img/default-avatar.png",
        };
        const newUser = await new AdminModel(createData).save();
        this.setToken(user_id); //设置token
        res.send({
          status: 200,
          token: this.token,
          username: newUser.username, //用户名
          avatar: newUser.avatar, //用户头像
          message: "注册用户并登录成功",
        });
      } else if (md5password === user.password) {
        //用户输入的账号存在并且密码正确
        this.setToken(user.id); //设置token
        res.send({
          status: 200,
          message: "登录成功",
          username: user.username, //用户名
          avatar: user.avatar, //用户头像
          token: this.token,
        });
      } else {
        res.send({
          status: -1,
          message: "该用户已存在，密码输入错误",
        });
      }
    } catch (err) {
      console.log("用户登录失败", err);
      res.send({
        status: -1,
        message: "用户登录失败",
      });
    }
  };

  // 添加用户
  addUser = async (req, res, next) => {
    const { username, password, status, avatar } = req.body;
    console.log(req.body);
    const md5password = this.encryption(password);
    try {
      const admin = await AdminModel.findOne({ username, status });
      if (!admin) {
        const admin_id = await this.getId("user_id");
        const createData = {
          //创建一个新账号
          username, //用户名
          password: md5password, //用户密码
          id: admin_id, //用户id
          avatar,
          status,
        };
        let createAdmin = await new AdminModel(createData).save();
        res.send({
          status: 200,
          message: "新增用户成功",
          username: createAdmin.username,
          avatar: createAdmin.avatar,
        });
      } else {
        res.send({
          status: -1,
          message: "该用户已存在",
        });
      }
    } catch (err) {
      console.log("新增用户失败", err);
      res.send({
        status: -1,
        message: "新增用户失败",
      });
    }
  };

  // 修改用户
  editUser = async (req, res, next) => {
    const { username, status, avatar, id } = req.body;
    console.log(req.body);
    try {
      await AdminModel.findOneAndUpdate({ id }, { username, status, avatar });
      res.send({
        status: 200,
        message: "修改用户信息成功",
      });
    } catch (err) {
      console.log("修改用户信息失败", err);
      res.send({
        status: -1,
        message: "修改用户信息失败",
      });
    }
  };
  // 删除用户
  deleteUser = async (req, res, next) => {
    const { id } = req.query;
    try {
      await AdminModel.deleteOne({ id });
      res.send({
        status: 200,
        message: "删除用户成功",
      });
    } catch (err) {
      console.log("删除用户失败", err);
      res.send({
        status: -1,
        message: "删除用户失败",
      });
    }
  };

  // 加密
  encryption = (password) => {
    const md5password = this.Md5(this.Md5(password)); // 两次加密
    return md5password;
  };

  //md5加密
  Md5 = (password) => {
    const md5 = crypto.createHash("md5");
    return md5.update(password).digest("base64");
  };

  // 前端将头像的地址传过来，将其更新到数据库
  changeAvatar(req, res, next) {
    //  token验证通过之后，使用req.user.user_id即可获取到用户的user_id
    const { avatarUrl } = req.body;
    console.log(avatarUrl);
    const { user_id } = req.user;
    AdminModel.updateOne({ id: user_id }, { avatar: avatarUrl })
      .then(() => {
        res.send({
          status: 200,
          message: "更换头像成功",
        });
      })
      .catch((e) => {
        res.send({
          status: -1,
          message: "更新头像失败",
        });
      });
  }

  // 获取用户信息
  userInfo(req, res, next) {
    const { user_id } = req.user;
    AdminModel.findOne({ id: user_id }, "username avatar create_time status")
      .then((data) => {
        res.send({
          status: 200,
          data,
        });
      })
      .catch((e) => {
        console.log(e);
        res.send({
          status: -1,
          message: "获取用户信息失败",
        });
      });
  }

  // 获取所有用户信息
  getAllUserInfo(req, res, next) {
    AdminModel.find({}, "-_id -password")
      .then((data) => {
        res.send({
          status: 200,
          data,
        });
      })
      .catch((e) => {
        res.send({
          status: -1,
          message: "获取所有用户信息失败",
        });
      });
  }
}

export default new Admin();
