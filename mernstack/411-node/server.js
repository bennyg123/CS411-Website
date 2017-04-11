var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var port = 3002;

var dbUrl = 'mongodb://127.0.0.1:27017/cs411db';
var connection = mongoose.createConnection(dbUrl);

var UserDb = require('./userdb');
var User = UserDb.getModel(connection);

connection.on("open", function(){
	console.log("Connected");
});

// static resources

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./build'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});


// Routing
app.get('/getUser', (req, res) => {
    res.send('User obtained');
});

app.post('/loginUser', (req, res)=>{
    console.log(req.body);
    User.find(req.body, (err, results) => {
        console.log("A");
        if (err) {
            console.log("B");
            res.send({value: false, username: ""})
        }else {
            console.log(results.length);
            if(results.length == 0) {
                res.send({value:false,username:""});
            }else {
                res.send({value : results !== [], username: results[0].username});
            }
        }
    })
})

app.post('/createUser', (req, res) => {

    var user = new User({
        username: req.body.username,
	    password: req.body.password,
	    email: req.body.email
    })

    console.log(user);
    user.save();

    res.send(req.params);
})

app.listen(port, function(){
  console.log('http://localhost:' + port);
});























