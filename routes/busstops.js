var express= require('express');
var fs=require('fs');
var router=express.Router();
var busstops=[];
// var counter=0;

router.get('/',function(req, res){
	var db=req.db;
	var collection=db.collection('busstops');
	// console.log(collection);
	collection.find({}).toArray(function(e,docs){
		res.json(docs);
	});
});

router.get('/suggest',function(req,res){
	var db = req.db;
	var query=req.param('query');
	var collection=db.collection('busstops');
	// console.log(collection);
	collection.find({name:{'$regex':'^'+query}}).toArray(function(e,docs){
		res.json(docs);
	});
});

router.post('/add',function(req,res){
	var db=req.db;
	var collection=req.db.collection('busstops');
	collection.insert(req.body, function(err,doc){
		if(err){
			res.json({msg:"There was a problem in adding the information to the database"}, 400);
		}
		else{
			res.json(doc);
		}
	});
});

module.exports= router;