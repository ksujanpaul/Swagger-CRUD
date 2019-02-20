 'use strict';
	// Include our "db"
	var db = require('../../config/db')();
	
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
	
    // Exports all the functions to perform on the db
	module.exports = {getAll, save, getOne, update, delMovie};
    
	//GET /movie operationId
	function getAll(req, res, next) {
		db.collection('movielist').find({}).toArray(function(err, movies) {
					if (err) 
					{
						res.json(err);
					}
					else
					{
						res.json(movies);
					}
				});
    }
	
	//POST /movie operationId
	function save(req, res, next) {
		req.body.id = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
		db.collection('movielist').insertOne(req.body,
		function (err, res1) {
		if (err) {
		res.json({error: err, description: "Movie added to the list!"});
		}
		else{
		console.log(res1);
		res.json({success: 1, description: "Movie added to the list!"});
		}
		})
	}
	//GET /movie/{id} operationId
	function getOne(req, res, next) {
		console.log("Get function called")
		var id = req.swagger.params.id.value; //req.swagger contains the path parameters
				db.collection('movielist').findOne({id}, function(err, movie) {
					if (err) 
					{
			res.json(err);

					}
					else
					{
			res.json(movie);

					}
				});		
	}
	//PUT /movie/{id} operationId
	function update(req, res, next) {
		var id = req.swagger.params.id.value; //req.swagger contains the path parameters
		var myquery = { id: id };
		var newvalues = { $set: {title: req.body.title, year: req.body.year } };
		db.collection('movielist').updateOne(myquery, newvalues, function(err, res1) {
    if (res1) {
		res.json({success: 1, description: "Movie updated!"});
	}
	else
		{
			res.status(204).send();
		}
  });
	}
	//DELETE /movie/{id} operationId
	function delMovie(req, res, next) {
		var myquery = { id: req.swagger.params.id.value };
			db.collection('movielist').deleteOne(myquery, function(err) {
				if (err){ 
				res.status(204).send();
				}
				else{
					res.json({success: 1, description: "Movie Deleted!"});
				}
				});
	}