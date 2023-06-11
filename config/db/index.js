var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: "bjhgwqf7djeuvlqbsvcv-mysql.services.clever-cloud.com",
  user: "uimtpiqgv1abifhq",
  port: 3306,
  password: "rG3LMLx9eOehvjZFlhOE",
  database: "bjhgwqf7djeuvlqbsvcv",
});
connection.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("connect success");
  }
});
module.exports = connection;
