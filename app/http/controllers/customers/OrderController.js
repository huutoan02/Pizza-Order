const Order = require("../../../models/Order");
const moment = require("moment");

class OrderController {
  async index(req, res) {
    const orders = await Order.find({ customerId: req.user._id }).sort({
      createdAt: -1,
    });
    res.header("Cache-Control", "no-store");
    res.render("customers/orders", { orders: orders, moment: moment });
  }

  store(req, res) {
    const { phone, address, paymentType } = req.body;

    const order = new Order({
      customerId: req.user._id,
      items: req.session.cart.items,
      phone,
      address,
      paymentType,
    })
      .save()
      .then((result) => {
        req.flash("success", "Order placed successfully");
        delete req.session.cart;
        return res.redirect("/customer/orders");
      })
      .catch((err) => {
        req.flash("err", "Something went wrong");
        return res.redirect("/cart");
      });
  }

  cancel(req, res) {
    const orderId = Object.keys(req.body)[0];

    Order.findById(orderId).then((order) => {
      order.remove();
      return res.redirect("/customers/orders");
    });
  }
}

module.exports = new OrderController();
