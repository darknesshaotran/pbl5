const db = require("../config/db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var salt = bcrypt.genSaltSync();

const account = function (account) {
  (this.id = account.id),
    (this.Username = account.Username),
    (this.Password = account.Password),
    (this.id_Role = account.id_Role);
};
account.register = function (data, result) {
  // data = [username,password,idRole,firstName,lastName,phoneNumber]
  db.query(
    "SELECT * FROM account WHERE Username = ?",
    data.Username,
    function (err, users) {
      if (err) return result({success: false,message: err.message});
      else if (users.length > 0) {
        result({ success: false, message: "Username đã được sử dụng" });
      } else {
        bcrypt.hash(data.Password, salt, (err, hash) => {
          if (err) result({success: false,message: err.message});
          else {
            db.query(
              "INSERT INTO account (Username, Password, id_Role) VALUES (?, ?, ?)",
              [data.Username, hash, data.id_Role],
              function (err, user) {
                if (err) result({success: false,message: err.message});
                else {
                  db.query(
                    "INSERT INTO inforuser (id_Account,FirstName,LastName,PhoneNumber,Address, Avatar) VALUES (?, ?, ?, ?, ?, '')",

                    [
                      user.insertId,
                      data.FirstName,
                      data.LastName,
                      data.PhoneNumber,
                      data.Address,
                    ],
                    function (err, users) {
                      if (err) result({success: false,message: err.message});
                      else {
                        var today = new Date();
                        db.query(
                          "INSERT INTO cart (id_Account,Created_Date) VALUES (?, ?)",
                          [user.insertId, today],
                          function (err, cart) {
                            if (err) result({success: false,message: err.message});
                            else {
                              result({
                                success: true,
                                message: "Đăng ký thành công",
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  );
};
account.login = function (data, result) {
  db.query(
    "SELECT * FROM account WHERE Username = ?",
    data.Username,
    function (err, users) {
      if (err) {
        result({success: false,message: err.message});
      }
      if (users.length === 0) {
        return result({ success: false, message: "Username not found" });
      }

      const user = users[0];
      db.query(
        "SELECT * FROM role WHERE id = ?",
        user.id_Role,
        function (err, role) {
          bcrypt.compare(data.Password, user.Password, function (err, results) {
            if (err) {
              result({success: false,message: err.message});
            }
            if (results === false) {
              return result({ success: false, message: "Wrong password" });
            }

            const token = jwt.sign(
              {
                id: user.id,
                role: role[0].roleName,
              },
              "mk"
            );

            result({ success: true, token: token, role: role[0].roleName });
          });
        }
      );
    }
  );
};
account.find = function (id, result) {
  db.query("SELECT * FROM account WHERE id = ?", id, function (err, users) {
    if (err) {
      result({success: false,message: err.message});
    } else {
      result(users[0].Username);
    }
  });
};
account.changePassWord = function (idAccount, data, results) {
  db.query("SELECT * FROM account WHERE id = ?", idAccount, (err, user) => {
    bcrypt.compare(data.Password, user[0].Password, function (err, result) {
      if (err) result({success: false,message: err.message});
      if (result === false)
        return results({ success: false, message: "Mật khẩu cũ không đúng" });
      else if (data.Password == data.NewPassword)
        return results({
          success: false,
          message: "Mật khẩu mới trùng mật khẩu cũ",
        });
      else if (data.NewPassword != data.AgainPassword)
        return results({ success: false, message: "Không khớp mật khẩu mới" });
      else {
        bcrypt.hash(data.NewPassword, salt, (err, hash) => {
          if (err) result({success: false,message: err.message});
          else {
            db.query(
              "UPDATE account SET Password = ? WHERE id =?",
              [hash, idAccount],
              function (err, user) {
                if (err) result({success: false,message: err.message});
                else
                  return results({
                    success: true,
                    message: "Đổi mật khẩu thành công",
                  });
              }
            );
          }
        });
      }
    });
  });
};
module.exports = account;
