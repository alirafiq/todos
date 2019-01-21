/**
 * Created by ali on 7/11/18.
 */


const config = require('../services/config');

const host = config.server;
const dbs = config.database;
const port = config.db_port;

const mongoose = require("mongoose");

console.log("Database : "+dbs);

const uri = 'mongodb://'+host+":"+port+"/"+dbs;

console.log(uri)
mongoose.connect(uri);
mongoose.set('debug', true);
const dbSchema = require("./schema");

module.exports = {
    userSchema:mongoose.model('users',dbSchema.userSchema()),
    taskSchema:mongoose.model('tasks',dbSchema.taskSchema()),
}

