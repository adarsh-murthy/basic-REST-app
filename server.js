// server.js
//BASE SETUP
// ==================================================================================================
var mongoose = require('mongoose');
mongoose.connect('mongodb://@DESKTOP-H7675D1:27017/');  //Connect to our database
//call the packages we need
var Object = require('./app/models/Object');
var express = require('express');   //call express
var app = express();    //define our app using express
var bodyParser = require('body-parser');

//Configure app to use bodyParser()
//this will let us get the data from a POST

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;    //set our port

//Function to return errors
function E(req,err,res){
    j = {"Verb" : req.method, "URL" : req.url, "message" : err.message};
    res.json(j);
}
//ROUTES FOR OUR API
// ===================================================================================================
var router = express.Router();  //get an instance of the express router

//middleware to use for all requests
router.use(function(req,res,next){
    //do logging
    console.log('Request: ', req.method, ' ', req.url);
    next();     //make sure we go to the next routes and don't stop here
});


//more routes for our API will happen here

//on routes that end in /objects
//---------------------------------------------------------------------------------------------
router.route('/objects')

//create an object (accessed at POST http://localhost:8080/api/objects)
.post(function(req,res){
    console.log("in post: ", req.body);
    Object.create(req.body,function(err){
        if (err)
            E(req,err,res);
        res.json({message: 'Object created'});
    });
})

//get all the objects (accessed at GET http://localhost:8080/api/objects)

.get(function(req,res){
    Object.find({},{},function(err,objects){
        if(err)
            E(req,err,res);
            
        var U = [];
        str="http://"+req.headers.host+"/api/objects/";
        for (i = 0; i<objects.length;i++){
            j = objects[i]["_id"]
            U.push({"url": str+j});
            
        }
        res.json(U);
    });
});

//on routes that end in /objects
//---------------------------------------------------------------------------------------------
router.route('/objects/:object_id')
//get the object with that id (accessed at GET...)
.get(function(req,res){
    Object.findById(req.params.object_id,function(err,object){
        if (err){
            E(req,err,res);    
        }
        res.json(object);
    });
})

//update the object with this id
.put(function(req,res){
    //use our object model to replace the object we want
        Object.collection.update({"_id" : mongoose.Types.ObjectId(req.params.object_id)}, req.body, function(err,data){
            if(err)
                E(req,err,res);
            res.json(data);
        });
        
})

//delete a object with this id
.delete(function(req,res){
    Object.remove({
        _id: req.params.object_id
    }, function(err,object){
        if(err)
            E(req,err,res);
        res.json({message: 'Successfully deleted!'});
    });
});

//REGISTER OUR ROUTES -----------------------
//all of our routes will be prefixed with /api
app.use('/api', router);

//START THE USER
// =====================================================================================================
app.listen(port);
console.log('Starting on port ' + port);
