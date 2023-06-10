var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: "containers-us-west-168.railway.app",
  user: "root",
  port: 7335,
  password: "Zi8GFFe88kt9VLYnAHFg",
  database: "railway",
});
connection.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("connect success");
  }
});
module.exports = connection;
