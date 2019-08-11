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
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

mongoose
  .connect(
    "mongodb+srv://cmuth001:uIQc0vhkYeHTbzkI@chat-room-eqvp3.mongodb.net/secure-rest-api?retryWrites=true&w=majority", { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
// // Connect to Mongoose and set connection variable
// mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true});
// var db = mongoose.connection;

// // Added check for DB connection
// if(!db)
//     console.log("Error connecting db")
// else
//     console.log("Db connected successfully")
// Sending message to the default Route
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

