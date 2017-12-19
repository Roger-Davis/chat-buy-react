const express = require("express");
const model = require("./model");
const User = model.user;
const key = require("./key");
const jwt = require("jsonwebtoken");
const Router = express.Router();

Router.post("/register", function(req, res) {
  const { user, pwd, type } = req.body;
  User.findOne({ user }, function(e, d) {
    if (d) {
      return res.json({ code: 1, msg: "已存在该用户" });
    }
    const model = new User({ user, pwd, type });
    model.save(function(error, doc) {
      if (error || !doc) {
        return res.json({ code: 1, msg: "后端出错" });
      }
      const { user, type, _id } = doc;
      const token = jwt.sign({ id: _id }, key, {
        expiresIn: 60 * 60 * 24 * 7
      });
      return res.json({ code: 0, token, data: { user, type, id: _id } });
    });
  });
});

Router.post("/login", function(req, res) {
  const { user, pwd } = req.body;
  User.findOne({ user, pwd }, { pwd: 0 }, function(e, doc) {
    if (!doc) {
      return res.json({ code: 1, msg: "用户名或密码错误" });
    }
    if (e) {
      return res.json({ code: 1, msg: "后端出错" });
    }
    const { user, type, _id } = doc;
    const token = jwt.sign({ id: _id }, key, {
      expiresIn: 60 * 60 * 24 * 7
    });
    return res.json({ code: 0, data: { user, type, id: _id }, token });
  });
});

Router.post("/info", function(req, res) {
  const { id } = req.decoded;
  User.findOne({ _id: id }, function(e, user) {
    if (e || !user) {
      return res.json({ code: 2, msg: "后端出错" });
    }
    return res.json({
      code: 0,
      data: {
        user: user.user,
        type: user.type,
        id: user.id
      }
    });
  });
});

Router.post("/orders", function(req, res) {
  const { id } = req.decoded;

  User.findOne({ _id: id })
    .populate({ path: "orders", options: { sort: { date: -1 } } })
    .exec(function(error, user) {
      if (error) {
        return res.json({ code: 1, msg: "后端出错" });
      }
      if (!user) {
        return res.json({ code: 2, errorMsg: "找不到该用户" });
      }

      return res.json({ code: 0, data: user.orders });
    });
});

module.exports = Router;
