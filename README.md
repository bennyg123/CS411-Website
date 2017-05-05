# CS411-Website
---------------------------------------------
Please run a servfice of mongo before starting the app

Mernstack 411 Node is used for our database testing. We created a user login system.
Twitter API test was the first API test deliverable.
411Assigment3.pdf showed the user expereince flow diagrams
411FinalProject is the final submission

---------------------------------------------
#Description

For our project we made a website aimed towards small music professionals and local bands. We would have the user enter a twitter search term (ie: their band name), and also pick a particular venue category (general venues, comedy clubs, etc). Then a list of tweets listed sorted by popularity and a map showing the venue locations would show up. We used a MERN stack, MongoDB, Express, React, and Node. We choose Mongo because it was simple, easy to use and fast, as since our data did not need alot of relations it fit our purposes, Express and Node were the router and backend respectively for their easy implmentation with Mongo and also high scalability and popularity in the computing world. React was an interesting choice as we could have easily choosen Angular, a much older and much more well documented framework, however we wanted to challenge outselves learning something new, and also because React is becoming more and more popular with sites like AirBnB and Netflix using React.

We met weekly or bi-weekly depending on schedule conflicts, often for 30 min to 1 hour at a time. During these meetings we often assigned reasearch tasks, such as reasrching a particular API to writing code, that we would then share and explain. 

#Design and Structure:

Inside the 411FinalProject folder you will find the server.js file, the UserDB and LocationDB moongoose schemas. As much of our website was client side, the server was primarliy used to get API data, as we couldn't get it directly from the front end due to a cross-origin error. Our server called both the twitter and yelp API's, twitter released a node package so we used that, whike Yelp was done through the request libary and also with help from POSTMAN.

Our index html was the anchor point for React, as React is essentially just plain js manipulating the code on the html page. 

Inside our src folder, this is where the React code lies. React is split among components, which in our case, represented the individual pages of our website. We used React as the front end, Redux to keep track of the internal state, and React-Router to provide client side routing.

We also used Material-UI libary for styling, the leaflet api for the map, and sentiment npm package for sentiment analysis.

#Difficulties:

Learning React, integrating with Redux and integrating everything with React-Router. This was by far the hardest part of the creation of the website, as React is a new framework, with a new design philosphy that none of us were use to. Coupled with out limited webdev knowledge is was quite a challenge as we did not get it fully running until late into development, however it was a fun challenge.

#Revisions

Our intital design was to have a map that showed the sentitment analysis of all 50 states, and have the user click on each to check the tweets and score. However due to the limitation of the Twitter API we had to change the map clicking, to a drop down box for the city, state.

#Timeline (listed by group meetings, we did not keep track of the dates)


