// Importing Express Framework
var  express  = require("express");

var bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Intializing the app
var app = express();

// Import Route Module
var apiRoutes = require('./routes/api-routes');
var authRoutes = require('./routes/auth-routes');
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Setup server port
var port = process.env.PORT || 3000;
app.use('/v1/api', apiRoutes);
app.use('/v1/auth', authRoutes);

mongoose
  .connect(
    "mongodb+srv://cmuth001:uIQc0vhkYeHTbzkI@chat-room-eqvp3.mongodb.net/secure-rest-api", { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
app.get('/', function (req, res) {
    res.json({
        status: 'Main page',
        message: 'Welcome to the world of RESTAPI',
        description: 'Goto /api to explore API'
    });
});
// Launch app to listen to the specified PORT
app.listen(3000, () => {
 console.log(`Server running on port ${port}`);
});

