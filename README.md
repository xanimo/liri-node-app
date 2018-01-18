# liri-node-app
_Language Interpretation and Recognition Interface_
This is the project repository for LIRI.  A command line language interpretation and recognition interface programmed to query and fetch the last 20 tweets from a Twitter account, a track from Spotify including the Artist, Track, Album names and a preview URL, a movie from OMDB including Title, Year, Rating, Rotten Tomatoes Rating, Rotten Tomatoes Url, Country of Origin, Language, Plot and Cast, and lastly integration with the node_module 'fs' to read a track name set in the random.txt file which queries and fetches track information from Spotify.  All queries and errors are logged in the log.txt file.  

#Installation
>npm install --save dotenv node-spotify-api omdb request spotify twitter

Next retrieve required authentication credentials and include in a .env file in the root directory:

	# Spotify API keys

	SPOTIFY_ID=your-spotify-id
	SPOTIFY_SECRET=your-spotify-secret

	# Twitter API keys

 	 TWITTER_CONSUMER_KEY=your-twitter-consumer-key
	 TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
	 TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
	 TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

Reference the .env file in a new file called keys.js with the following:

  	exports.twitter = {
  	  consumer_key: process.env.TWITTER_CONSUMER_KEY,
 	  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	  };

 	 exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
 	 };

Once you have aquired and filled in the necessary login information, include this code block in your liri.js file at the top of the page:

 	 require('dotenv').config();
	 var Twitter = require('twitter');
	 var Spotify = require('node-spotify-api');
 	 var request = require('request');
 	 var fs = require('fs');
 	 var keys = require('./keys.js');

	var client = new Twitter(keys.twitter);
	var spotify = new Spotify(keys.spotify);
  
Once these are set you will be able to write functions to query Twitter and Spotify.  The only other required information is appending an OMDB api key to the end of your OMDB query string like so:

	var queryString = 'http://www.omdbapi.com/?t=' + searchString + '&plot=full&tomatoes=true&apikey=<your OMDB api key>';


