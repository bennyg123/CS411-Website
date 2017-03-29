const express = require('express');
const app = express();
const Twitter = require('twitter');
const Request = require('request');

//deleted keys

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// setup handlebars view engine
const handlebars = require('express-handlebars');

app.engine('handlebars', 
	handlebars({defaultLayout: 'index'}));

app.set('view engine', 'handlebars');


app.get('/', (req, res) => {
	res.render('main');
});

app.post("/twitterSearch", (req, res) =>{
	var params = {
		screen_name: "Group2",
		count: "5",
		q: req.body.twitterterm
	}
	//console.log("Twitter");
	client.get('search/tweets.json', params, (error, tweets, response) => {
		if(!error) {
			
			tweetmessage = tweets["statuses"]
			/*
			for (var i = 0; i < 5; i++) {
				var message = '{\'documents\': [{\'language\': \'en\',\'id\': \'string\',\'text\': \'' + tweets['statuses'][i]['text'].split(":")[1] + '\'}}'
				options["body"] = message
				//if (i ==0) {console.log(options)};
				Request(options, function (error, response, body) {
  					if (error) throw new Error(error);
					  	var body2 = JSON.stringify(body)
					    //tweetmessage[i] += '   ' + body['documents'][0]['score']
						console.log(body2)
					});
			}*/
			
			res.render("main", {
				person: tweetmessage
			})
		}
	})
});

app.get("/twitterSearch", (req, res) => {
	res.redirect("/")
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});