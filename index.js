const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const _ = require("lodash");
// parse application/json
app.use(bodyParser.json());
//create database connection
const conn = mysql.createConnection({
  host: "127.0.0.1",
  port: 3307,
  user: "tagtaste",
  password: "password",
  database: "hestabit"
});
//connect to database
conn.connect(err => {
  if (err) throw err;
  console.log("Mysql Connected...");
});
//getting count for the of users invited
app.get("/api/invited/users/count", (req, res) => {
  let sql = "SELECT count(*) as total FROM Profiles where code_id IS NOT NULL";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(
      JSON.stringify({ status: 200, error: null, data: results[0].total })
    );
  });
});

//list of users who have invites there friends
app.get("/api/invited/users/friends", (req, res) => {
  let sql =
    "SELECT p1.firstname as Name, p2.firstname as Invited from Profiles p1 join Code on p1.id = Code.profile_id join Profiles p2 on Code.id = p2.code_id";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    let group = _.mapValues(_.groupBy(results, "Name"), clist =>
      clist.map(results => _.omit(results, "Name"))
    );
    res.send(JSON.stringify({ status: 200, error: null, data: group }));
  });
});

//Server listening
app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
