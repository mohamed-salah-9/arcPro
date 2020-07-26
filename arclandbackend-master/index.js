const express = require('express')
require('./src/db/mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const path = require("path");
const bodyParser = require("body-parser");

//REQUIRED ROUTES
const bussines = require('./src/routers/bussines')
const locationrouter = require('./src/routers/location')
const location_detailrouter = require('./src/routers/location_detail')
const adminrouter = require('./src/routers/admin')
const billsrouter = require('./src/routers/bills')
const bandrouter = require('./src/routers/bands')
const imagerouter = require('./src/routers/images')
const website_detail = require('./src/routers/website_detail')
const videos = require('./src/routers/videos')
const sponsors = require('./src/routers/sponsors')
const contact = require('./src/routers/contact')
const app = express()
app.use(cors())
const port = process.env.PORT || 3000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static("public/images"));
app.use(express.static("public/videos"));
app.use(express.static("public/sponsors"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", false);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});
//call the routes to work
app.use(bussines)
app.use(location_detailrouter)
app.use(locationrouter)
app.use(adminrouter)
app.use(billsrouter)
app.use(bandrouter)
app.use(imagerouter)
app.use(website_detail)
app.use(videos)
app.use(sponsors)
app.use(contact)


app.listen(3000, () => {
  console.log('Listening on port 3000');
});
