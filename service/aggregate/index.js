const Account = require("./accountAggregate/Account");
const Address = require('./addressAggregate/Address');
const Order = require("./orderAggregate/Order");
const OrderDetail = require("./orderDetailAggregate/OrderDetail")
const User = require('./userAggregate/User');

module.exports = {
    Account,
    Address,
    Order,
    OrderDetail,
    User
}