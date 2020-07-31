// init project
var express = require("express");
var Sequelize = require("sequelize");
var app = express();
var bodyParser = require("body-parser");
var short_uuid = require("short-uuid");
require("./db/config");

// Using `public` for static files: http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// Use bodyParser to parse application/x-www-form-urlencoded form data
var urlencodedParser = bodyParser.urlencoded({ extended: false });

console.log("env: ", process.env.USER, process.env.PASSWORD);

// setup a new database using database credentials set in .env
var sequelize = new Sequelize(
  "database",
  process.env.USER,
  process.env.PASSWORD,
  {
    host: "0.0.0.0",
    dialect: "sqlite",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    // Data is stored in the file `database.sqlite` in the folder `db`.
    storage: "/sandbox/src/db/database.sqlite"
  }
);

// authenticate with the database
sequelize
  .authenticate()
  .then(function(err) {
    console.log("Connection established.");

    Post = sequelize.define("posts", {
      uuid: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      cipher_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      expiration: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  })
  .catch(function(err) {
    console.log("Unable to connect to database: ", err);
  });

// Get post data
app.get("/posts", function(request, response) {
  Post.findAll().then(function(posts) {
    // finds all entries in the posts table
    response.send(posts); // sends posts back to the page
  });
});

// create a new entry in the posts table
app.post("/new", urlencodedParser, function(request, response) {
  var expiration = 0;
  switch (request.body.expiration) {
    case "Burn after reading":
      expiration = 0;
      break;
    case "1 day":
      expiration = 1;
      break;
    case "1 month":
      expiration = 2;
      break;
    case "Never":
      expiration = 3;
      break;
    default:
      break;
  }
  var generated_uuid = short_uuid.generate(); // example: 73WakrfVbNJBaAmhQtEeDv
  Post.create({
    uuid: generated_uuid,
    cipher_text: request.body.cipher_text,
    expiration: expiration
  });
  response.send({ paste: generated_uuid, status: "", message: "" });
});

app.get("/reset", function(request, response) {
  posts = [];
  response.redirect("/");
});

app.get("/", function(request, response) {
  response.sendFile("/sandbox/views/index.html");
});

// Listen on port 8080
var listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
