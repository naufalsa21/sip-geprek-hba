const db = require("../config/db");

const findUserByPhone = (telepon, callback) => {
  const query = "SELECT * FROM users WHERE telepon = ?";
  db.query(query, [telepon], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);

    const user = results[0];
    callback(null, user);
  });
};

module.exports = {
  findUserByPhone,
};
