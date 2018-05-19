// Retrieve keys info
require('dotenv').config();
var keys = require('./keys.js');
var fs = require('fs');

// Capture user input from the command line
var request = process.argv[2];
var input = process.argv.slice(3);

liriCommands(request, input);

// Checks user request 
function liriCommands(request, input) {
    switch (request) {
        case 'my-tweets':
            twitterFunc();
            break;
        case 'spotify-this-song':
            spotifyFunc(input);
            break;
        case 'movie-this':
            omdbFunc(input);
            break;
        case 'do-what-it-says':
            randomFunc();
            break;
        default:
            console.log('enter one of the following commands: my-tweets, spotify-this-song, movie-this, or do-what-it-says.');
    }
}

// Retrieve most recent 20 tweets with date stamp
function twitterFunc() {
    var Twitter = require('twitter');
    var twitterKey = new Twitter(keys.twitter);
    var params = { screen_name: 'barbeyng_' };
    twitterKey.get('statuses/user_timeline', params, function (err, tweets, response) {
        if (!err) {
            for (var i = 0; i < 20; i++) {
                var tweet = tweets[i];
                console.log(tweet.text);
                console.log('Tweeted on: ' + tweet.created_at);
                console.log("===========================================");
            }
        } else {
            console.log(err);
        }
    });
}

// Pass user input into spotify API to retrieve song info
function spotifyFunc(input) {
    var Spotify = require('node-spotify-api');
    var spotifyKey = new Spotify(keys.spotify);
    // if user leaves blank, default The Sign by Ace of Base
    if (input.length < 1) {
        input = 'Ace of Base "The Sign"';
    }
    spotifyKey.search({ type: 'track', query: input }, function (err, data) {
        if (!err) {
            songName = data.tracks.items[0];
            var searchData = ['\n\n' +
            '===========================================\n\n' +
            'Artist: ' + songName.artists[0].name,
            'Song name: ' + songName.name,
            'Preview here: ' + songName.preview_url,
            'Album: ' + songName.album.name,
            ].join('\n\n');
            fs.appendFile('log.txt', searchData, function (err) {
                if (err) throw err;
                console.log('\n' + searchData + '\n');
            });
        } else {
            console.log(err);
        }
    });
}

// Pass user input through omdb API to retrieve movie info
function omdbFunc(input) {
    var request = require('request');
    // if no user input, default movie to Mr. Nobody
    if (input.length < 1) {
        input = 'Mr. Nobody';
    }
    var query = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&r=json&apikey=trilogy";
    request(query, function (err, response, body) {
        if (!err) {
            var movie = JSON.parse(body);
            var searchData = ['\n\n' +
                '===========================================\n\n' +
                'Movie name: ' + movie.Title,
            'Year released: ' + movie.Year,
            'IMDB rating: ' + movie.imdbRating,
            'Rotten Tomatoes: ' + movie.Ratings[1].Value,
            'Country produced: ' + movie.Country,
            'Language: ' + movie.Language,
            'Plot: ' + movie.Plot,
            'Actors: ' + movie.Actors
            ].join('\n\n');
            fs.appendFile('log.txt', searchData, function (err) {
                if (err) throw err;
                console.log('\n' + searchData + '\n');
            });
        } else {
            console.log(err);
        }
    });
}

// Takes command by reading random.txt
function randomFunc(input) {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (!err) {
            txtData = data.split(',');
            liriCommands(txtData[0], txtData[1].split(' '));
        } else {
            console.log(err);
        }
    });
}
