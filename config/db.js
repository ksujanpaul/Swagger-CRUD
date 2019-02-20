'use strict;'
//Include crypto to generate the movie id
var crypto = require('crypto');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://mss:mss777@ds123465.mlab.com:23465/movielist";
var bodyparser = require('body-parser');
var db;
MongoClient.connect(url, function(err, client) {
  console.log("Connected correctly to server");
  db = client.db('movielist');

  //client.close();
});

module.exports = function() {
	return {
		save(movie) {	
			movie.id = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
			//console.log(movie, 'before insertion')			
			db.collection('movielist').insertOne(movie,
		function (err, res) {
		if (err) {
			return console.log(err);
		}
		else{
		console.log(movie);
		return console.log(1);
		}
		})
		
		},
		/*
		 * Retrieve a movie with a given id or return all the movies if the id is undefined.
		 */
		find(id) {
			if(id) {
				
				 return db.collection('movielist').findOne({id}, function(err, movie) {
					if (err) 
					{
						return console.log(err);
					}
					else
					{
						return console.log(movie);
					}
				});	
			}else {
				return db.collection('movielist').find({}).toArray(function(err, movies) {
					if (err) 
					{
						return console.log(err);
					}
					else
					{
						return console.log(movies);
					}
				});
			}
							},
		/*
		 * Delete a movie with the given id.
		 */
		remove(id) {
			var found = 0;
			var myquery = { id: id };
			db.collection('movielist').deleteOne(myquery, function(err) {
				if (err){ 
				return console.log(err);
				}
				else{
					found = 1;
					console.log("1 document deleted", found);
					return 1;
				}
				});
				
		},
		/*
		 * Update a movie with the given id
		 */
		update(id, movie) {
			var movieIndex = this.movieList.findIndex(element => {
				return element.id === id;
			});
			if(movieIndex !== -1) {
				this.movieList[movieIndex].title = movie.title;
				this.movieList[movieIndex].year = movie.year;
				return 1;
			}else {
				return 0;
			}
		}		
	}
};  