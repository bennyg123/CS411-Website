var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const Twitter = require('twitter');
const Request = require('request');
const cities = require('./cities.json');
var port = 3002;

var axios = require('request');

var dbUrl = 'mongodb://127.0.0.1:27017/cs411db';
var connection = mongoose.createConnection(dbUrl);

var UserDb = require('./userdb');
var User = UserDb.getModel(connection);

var LocationDB = require('./locationdb');
var Location = LocationDB.getModel(connection);

connection.on("open", function(){
	console.log("Mongodb Connected");
});

//caching sentiment
//ROUTING
//FORMAT


var client = new Twitter({
  consumer_key: 'peQHdiVK6hs9Zvv8W802aqCpe',
  consumer_secret: 'P86Ft0a70WBrP486Fns2LgvFBXNI3vNUbT0Rd0dt14x1xtCpeL',
  access_token_key: '2324372889-FfQT1K5FIXECWbbAQmRppG0nAcAEHZaWzWgA2rD',
  access_token_secret: 'xEY20cRk7MKKVAZSUAQ0AKxpnUf2fnBHQoRuoxweDPtnL'
});

var yelp_api_key = "HVB__PRkRm-c0-jHS9l9-FTwfk9076RFXvzh7NQfN9WhTcGmU8hrLkHhGBsA21ti0ZsQvBaY_c3RMj4dGMre93IyEi7FwFGN2vZxkVgYO0WK_3KnkMngAmBuaYD_WHYx";
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
    //console.log(req.body);
    User.find(req.body, (err, results) => {
        //console.log("A");
        if (err) {
            //console.log("B");
            res.send({value: false, username: ""})
        }else {
            //console.log(results.length);
            if(results.length == 0) {
                res.send({value:false,username:""});
            }else {
                res.send({value : results !== [], username: results[0].username});
            }
        }
    })
});

app.post("/yelpSearch",(req, res) => {
    var request = require("request");

    var options = { method: 'GET',
    url: 'https://api.yelp.com/v3/businesses/search',
    qs:{
        latitude:cities[req.body.capital].latitude,
        longitude:cities[req.body.capital].longitude,
        categories:req.body.category,
        radius:40000,
        locale:'en_US',
        limit:35,
    },
    headers: 
    {authorization: 'Bearer HVB__PRkRm-c0-jHS9l9-FTwfk9076RFXvzh7NQfN9WhTcGmU8hrLkHhGBsA21ti0ZsQvBaY_c3RMj4dGMre93IyEi7FwFGN2vZxkVgYO0WK_3KnkMngAmBuaYD_WHYx' } };
    //console.log(options);

    Location.find({username: cities[req.body.capital].latitude+""+cities[req.body.capital].longitude}, (err, results) =>{
        if (err) {
            throw err;
        }else {
            if(results.length !== 0) {
                res.send(JSON.parse([results[0].locationdata,cities[req.body.capital]]));
            }
        }
    })

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var local = new Location({
            locationname: cities[req.body.capital].latitude+""+cities[req.body.capital].longitude,
            locationdata: response.body
        });
        local.save();
        res.send([JSON.parse(response.body),cities[req.body.capital]]);
    });

})

app.post("/twitterSearch", (req, res) =>{

    //console.log(cities[req.body.capital]);

	var params = {
		screen_name: "Group2",
		count: "15",
        lang: "en",
        //result_type: "popular",
        geocode: cities[req.body.capital].latitude + "," + cities[req.body.capital].longitude + ",1000mi",
		q: req.body.twitterterm+" -RT"
	}
    
    client.get('search/tweets.json', params, (error, tweets, response) => {
		if(!error) {
			
			tweetmessage = tweets["statuses"]
			res.send(tweetmessage);
		}else {
            console.log(error)
        }
	});
});

app.post('/createUser', (req, res) => {

    var user = new User({
        username: req.body.username,
	    password: req.body.password,
	    email: req.body.email
    })

    //console.log(user);
    user.save();

    res.send(req.body.username);
});

app.listen(port, function(){
  console.log('http://localhost:' + port);
});























