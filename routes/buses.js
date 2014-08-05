var express = require('express');
var fs = require('fs');
var Firebase = require("firebase");
var router = express.Router();
var busstops=[];

/* GET users listing. */
router.get('/', function(req, res) {
	var db = req.db;
	var collection = db.collection('buses');
	collection.find({}).toArray(function(e,docs){
		res.json(docs);
	});
});

router.get('/suggest', function(req, res) {
	var db = req.db;
	var query=req.param('query');
	var collection = db.collection('buses');
	collection.find({bus_no:{'$regex':'^'+query}}).toArray(function(e,docs){
		res.json({query:"Unit", suggestions:docs});
	});
});

router.post('/add', function(req,res){
	var db= req.db;
	var collection = req.db.collection('buses');
	collection.insert(req.body, function(err,doc){
		if(err){
			res.send("There was a problem adding the information to the database");
		}
		else{
			res.json(doc);
		}
	});
});

/**
	{"bus_no":"335E", "from":"Majestic", "to":"ITPL", "reg_no":"KA 03 MP 1722", "location":{"latitude":12.6585, "longitude":32.753}, "time":"2014-07-24 12:32:23"}
*/

router.get('/locations', function(req, res) {
	var db = req.db;
	var collection = db.collection('locations');
	collection.find({}).toArray(function(e,docs){
		res.json(docs);
	});
});

router.post('/location', function(req, res){
	var db= req.db;
	var collection = req.db.collection('locations');
	var reg_no = req.body.reg_no;
	var from = req.body.from;
	var to = req.body.to;
	var location = req.body.location;
	var bus_no = req.body.bus_no;

	collection.update({reg_no:reg_no}, {$set:{stale:1}}, {multi:true}, function(err, result){
		if(!err){
			req.body.stale = 0;
			collection.insert(req.body, function(err,doc){
			if(err){
				res.send("There was a problem adding the information to the database");
			}
			else{
				res.json(doc);
				var ref = new Firebase("https://buslocator.firebaseio.com/"+bus_no+"_"+to);
				ref.child(reg_no).set(req.body);
			}
		});
		}

	});

	
});

router.get('/location', function(req, res){
	var db = req.db;
	var mygeolocation = req.param('mygeolocation');
	var bus_no = req.param('bus_no');
	var goingto = req.param('goingto');

	db.collection('locations').find({bus_no:bus_no, to:goingto, stale:0}).toArray(function(err, items){
		res.json(items);
	});
});


router.get('/:id/edit', function(req, res){
	res.json({bus:req.busID});
});



module.exports = router;
