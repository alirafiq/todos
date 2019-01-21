/**
 * Created by ali on 7/11/18.
 */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const users = () => {
    var user = mongoose.Schema({
        id: Schema.ObjectId,//primary key
        name: String,//User name
        email: {type: String, unique: true},//login email address
        password: String,//Encrypted
        active: {type: Boolean, default: true}, //user activation By Default True
        code: String,//user code sent on email
        auth_token: String,
        devices : [{
            fcm_token: String,//user firebase token
            platform: {type: String, enum: ['and', 'ios', 'web'], default: 'web'},//user firebase token
        }],
        ud: {type: Date, default: Date.now}, //updated Date
        dt: {type: Date, default: Date.now} //created Date
    });
    mongoose.model('users', user);
};


const task = () => {
    var task = mongoose.Schema({
        id: Schema.ObjectId,//primary key
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},//Task assign to one or more users
        title: {type: String},//login email address
        isPublic: {type: Boolean, default: false}, //Task available to
        active: {type: Boolean, default: false},//task active
        status: {type: String, enum: ['new', 'completed','finish'], default: 'new'},//task status
        completed: {type: Boolean, default: false},//task finished
        completed_by: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        ud: {type: Date, default: new Date()}, //updated Date
        dt: {type: Date, default: new Date()} //created Date
    });
    mongoose.model('tasks', task);
};


module.exports = {
    userSchema: users,
    taskSchema: task
}
