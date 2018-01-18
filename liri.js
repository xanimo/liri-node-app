require('dotenv').config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');

	var client = new Twitter(keys.twitter);
	var spotify = new Spotify(keys.spotify)

var cmdArgs = process.argv;

var liriCommand = cmdArgs[2];

var liriArg = '';
for (var i = 3; i < cmdArgs.length; i++) {
	liriArg += cmdArgs[i] + ' ';
}

function retrieveTweets() {
	fs.appendFile('./log.txt', 'Command: node liri.js my-tweets\n\n', (err) => {
		if (err) throw err;
	});

	var parameters = {screen_name: 'dakodagreaves', count: 20};

	client.get('statuses/user_timeline', parameters, function(error, tweets, response) {
		if (error) {
			var errorStr = 'ERROR: Retrieving user tweets -- ' + error;

			fs.appendFile('./log.txt', errorStr, (err) => {
				if (err) throw err;
				console.log(errorStr);
			});
			return;
		} else {
			var outputString = 'User Tweets:\n\n';

			for (var i = 0; i < tweets.length; i++) {
				outputString += 'Created On: ' + tweets[i].created_at + '\n' + 
							 'Content: ' + tweets[i].text + '\n';
			}

			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputString + '\n', (err) => {
				if (err) throw err;
				console.log(outputString);
			});
		}
	});
}

function spotifySong(song) {

	fs.appendFile('./log.txt', 'Command: node liri.js spotify-this-song ' + song + '\n\n', (err) => {
		if (err) throw err;
	});

	var searchString;
	if (song === '') {
		searchString = 'The Sign Ace Of Base';
	} else {
		searchString = song;
	}
	spotify.search({ type: 'track', query: searchString}, function(err, data) {
	    if (err) {
			var errorString1 = 'ERROR: Retrieving Spotify track -- ' + err;

			fs.appendFile('./log.txt', errorString1, (err) => {
				if (err) throw err;
				console.log(errorString1);
			});
			return;
	    } else {
			var songInfo = data.tracks.items[0];
			if (!songInfo) {
				var errorStr2 = 'ERROR: No song information retrieved, please check the spelling of the song name and try again!';

				fs.appendFile('./log.txt', errorStr2, (err) => {
					if (err) throw err;
					console.log(errorStr2);
				});
				return;
			} else {
				var outputString = 'Track Details:\n' + 
								'Artist: ' + songInfo.artists[0].name + '\n' +
								'Name: ' + songInfo.name + '\n' + 
								'Preview Url: ' + songInfo.preview_url + '\n' + 
								'Album: ' + songInfo.album.name + '\n';

				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputString + '\n', (err) => {
					if (err) throw err;
					console.log(outputString);
				});
			}
	    }
	});
}

function retrieveOBDBInfo(movie) {
	fs.appendFile('./log.txt', 'Command: node liri.js movie-this ' + movie + '\n\n', (err) => {
		if (err) throw err;
	});

	var searchString;
	if (movie === '') {
		searchString = 'Mr. Nobody';
	} else {
		searchString = movie;
	}

	searchString = searchString.split(' ').join('+');

	var queryString = 'http://www.omdbapi.com/?t=' + searchString + '&plot=full&tomatoes=true&apikey=57047ce1';

	request(queryString, function (error, response, body) {
		if ( error || (response.statusCode !== 200) ) {
			var errorString1 = 'ERROR: Retrieving OMDB entry -- ' + error;

			fs.appendFile('./log.txt', errorString1, (err) => {
				if (err) throw err;
				console.log(errorString1);
			});
			return;
		} else {
			var data = JSON.parse(body);
			if (!data.Title && !data.Released && !data.imdbRating) {
				var errorStr2 = 'ERROR: No movie information retrieved, please check the spelling of the movie name and try again!';

				fs.appendFile('./log.txt', errorStr2, (err) => {
					if (err) throw err;
					console.log(errorStr2);
				});
				return;
			} else {
		    	var outputString = 'Movie Details:\n' + 
								'Title: ' + data.Title + '\n' + 
								'Year: ' + data.Released + '\n' +
								'Rating: ' + data.imdbRating + '\n' +
								'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
								'Rotten Tomatoes Url: ' + data.tomatoURL + '\n' +
								'Country of Origin: ' + data.Country + '\n' +
								'Language: ' + data.Language + '\n' +
								'Plot: ' + data.Plot + '\n' +
								'Cast: ' + data.Actors + '\n';

				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputString + '\n', (err) => {
					if (err) throw err;
					console.log(outputString);
				});
			}
		}
	});
}

function doWhatItSays() {
	fs.appendFile('./log.txt', 'Command: node liri.js do-what-it-says\n\n', (err) => {
		if (err) throw err;
	});
	fs.readFile('./random.txt', 'utf8', function (error, data) {
		if (error) {
			console.log('ERROR: Reading random.txt -- ' + error);
			return;
		} else {
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var parameter = cmdString[1].trim();

			switch(command) {
				case 'my-tweets':
					retrieveTweets(); 
					break;

				case 'spotify-this-song':
					spotifySong(parameter);
					break;

				case 'movie-this':
					retrieveOBDBInfo(parameter);
					break;
			}
		}
	});
}

if (liriCommand === 'my-tweets') {
	retrieveTweets(); 
} else if (liriCommand === 'spotify-this-song') {
	spotifySong(liriArg);
} else if (liriCommand === 'movie-this') {
	retrieveOBDBInfo(liriArg);
} else if (liriCommand ===  'do-what-it-says') {
	doWhatItSays();

} else {
	fs.appendFile('./log.txt', 'Command: ' + cmdArgs + '\n\n', (err) => {
		if (err) throw err;
		outputString = 'Usage:\n' + 
				   '    node liri.js my-tweets\n' + 
				   '    node liri.js spotify-this-song "<song_name>"\n' + 
				   '    node liri.js movie-this "<movie_name>"\n' + 
				   '    node liri.js do-what-it-says\n';
		fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputString + '\n', (err) => {
			if (err) throw err;
			console.log(outputString);
		});
	});
}