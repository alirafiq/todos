/**
 * Created by ali on 7/11/18.
 */
const db = require('../db/conn');
const TASK = db.taskSchema;

class Task {
    static async create(taskObj) {
        return await new TASK(taskObj).save();
    }

    static async findByIdAndUpdate(taskObj, id) {
        return await TASK.findByIdAndUpdate(id, {'$set': taskObj}, {new: true})
            .populate('user_id',{_id:1,name:1}).populate('completed_by',{_id:1,name:1}).lean();
    }

    static async findOneAndUpdate(condition, taskObj, id) {
        return await TASK.findByIdAndUpdate(condition, {'$set': taskObj}, {new: true})
            .populate('user_id',{_id:1,name:1}).populate('completed_by',{_id:1,name:1}).lean();
    }

    static async findOne(condition) {
        return await TASK.findOne(condition)
            .populate('user_id',{_id:1,name:1}).populate('completed_by',{_id:1,name:1}).lean();
    }

    static async find(condition) {
        return await TASK.find(condition)
            .populate('user_id',{_id:1,name:1}).populate('completed_by',{_id:1,name:1}).sort({ud: -1}).lean();
    }

    static async remove(condition) {
        return await TASK.remove(condition);
    }
}
module.exports = Task;
