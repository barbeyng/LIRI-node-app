require('dotenv').config();
var keys = require('./keys.js');

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

function twitterFunc() {
    var Twitter = require('twitter');
    var twitterKey = new Twitter(keys.twitter);
    var params = { screen_name: 'barbeyng_' };
    twitterKey.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                var tweet = tweets[i];

                console.log(tweet.text);
                console.log('Tweeted on: ' + tweet.created_at);
                console.log("===========================================");
            }
        } else {
            console.log(error);
        }
    });
}

function spotifyFunc(input) {
    var Spotify = require('node-spotify-api');
    var spotifyKey = new Spotify(keys.spotify);
    if (input.length < 1) {
        input = 'Ace of Base "The Sign"';
    }
    spotifyKey.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
        }
        songName = data.tracks.items[0];

        console.log('Artist: ' + songName.artists[0].name);
        console.log('===========================================');
        console.log('Song name: ' + songName.name);
        console.log('===========================================');
        console.log('Preview here: ' + songName.preview_url);
        console.log('===========================================');
        console.log('Album: ' + songName.album.name);
        console.log('===========================================');
    });
}

function omdbFunc(input) {
    var request = require('request');
    if (input.length < 1) {
        input = 'Mr Nobody';
    }
    var query = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&r=json&apikey=trilogy";
    request(query, function (err, response, body) {
        console.log('Error occurred: ' + err);
        var movie = JSON.parse(body);
        console.log('Movie name: ' + movie.Title);
        console.log('===========================================');
        console.log('Year released: ' + movie.Year);
        console.log('===========================================');
        console.log('IMDB rating: ' + movie.imdbRating);
        console.log('===========================================');
        console.log('Rotten Tomatoes: ' + movie.Ratings[1].Value);
        console.log('===========================================');
        console.log('Country produced: ' + movie.Country);
        console.log('===========================================');
        console.log('Language: ' + movie.Language);
        console.log('===========================================');
        console.log('Plot: ' + movie.Plot);
        console.log('===========================================');
        console.log('Actors: ' + movie.Actors);
    });
}

function randomFunc(input) {
    var fs = require('fs');
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
        } else {
            txtData = data.split(',');
            liriCommands(txtData[0], txtData[1].split(' '));
        }
    });
}