const functions = require("firebase-functions");
const usersCrud = require("./users/index");
const pointsCrud = require("./points/index");

exports.users = usersCrud;
exports.points = pointsCrud;