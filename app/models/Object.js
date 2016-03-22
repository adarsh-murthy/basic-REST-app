// app/models/object
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectSchema = new Schema({
name : String,
dob : String,
occupation : String
},{strict: false, versionKey : false});

module.exports = mongoose.model('Object', ObjectSchema);
