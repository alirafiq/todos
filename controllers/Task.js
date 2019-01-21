const UserModel = require('../models/Users');
const TaskModel = require('../models/Task');
const Helper = require('../services/Helpers');
const FCM = require('../services/fcm');

class TaskController {
    static async create(req, res) {
        try {
            if (req.body.title) {
                var user = req.user;
                var newTask = req.body;
                newTask.user_id = user._id;


                const task = await TaskModel.create(newTask);
                if (task) res.send({status: true, code: 200, data: task});
                else res.send({status: true, code: 400, message: "Something went wrong"});


            } else {
                res.status(400)
                res.send({status: false, code: 400, message: "missing required parameter Email | Password | Name"})
            }
        } catch (e) {
            res.status(400)
            res.send({status: false, code: 400, message: "Something wen wrong " + e})

        }
    }

    static async getAll(req, res) {

        const user = req.user;
        const userId = user._id;
        const query = {"$or": [{'user_id': userId}, {'isPublic': true}]}
        const tasks = await TaskModel.find(query);
        if (tasks) {
            res.send({status: true, data: tasks})

        } else {
            res.send({status: true, data: []})
        }
    }

    static async update(req, res) {

        try {
            const user = req.user;
            let query = {"$or": [{'user_id': req.user._id}, {'isPublic': true}], _id: req.params.id}
            let task = await TaskModel.findOne(query);
            if (task) {
                let msg = `Task ${task.title} has been `;
                if (req.body.completed) {
                    msg = `${msg} completed by ${req.user.name}`;
                    task.completed = req.body.completed;
                    task.completed_by = req.user._id;
                }
                else {
                    msg = `${msg} opened by ${req.user.name}`;
                    task.completed = req.body.completed;
                    delete task.completed_by;
                }
                task.status = 'new';
                task.ud = new Date();

                task = await TaskModel.findOneAndUpdate(task._id, task);

                FCM.sendingMessage(user._id,msg)
                res.status(200)
                res.send({status: true, code: 200, message: "Updated Successfully",data:task})
            } else {
                res.status(400)
                res.send({status: false, code: 400, message: "Something wen wrong"})
            }
        } catch (e) {
            console.log(e)
            res.status(500);
            res.send({status: false, code: 500, message: "Something wen wrong"})

        }
    }
    static async delete(req, res) {

        try {
            const user = req.user;
            let query = {'user_id': req.user._id, _id: req.params.id}
            let task = await TaskModel.findOne(query);

            if (task) {
                await TaskModel.remove(query);
                res.status(200)
                res.send({status: true, code: 200, message: "Removed Successfully",data:task});
            } else {
                res.status(400)
                res.send({status: false, code: 400, message: "This is not your task"});
            }
        } catch (e) {
            res.status(500);
            res.send({status: false, code: 500, message: "Something wen wrong"});

        }
    }
}
module.exports = TaskController;
