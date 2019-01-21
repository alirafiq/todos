/**
 * Created by ali on 7/11/18.
 */
const db = require('../db/conn');
const USER = db.userSchema;

class User {
    static async create(user) {
        const exists = await USER.findOne({email: user.email},{_id:1}).lean();
        if (!exists)
            return await new USER(user).save();
        else
        throw new Error();
    }

    static async findByIdAndUpdate(id,user) {
        return await USER.findByIdAndUpdate(id, {'$set': user},  {new: true}).lean();
    }

    static async findOneAndUpdate(condition, user, id) {
        return await USER.findOneAndUpdate(condition, {'$set': user}, {new: true}).lean();
    }
    static async getAllToken(id){
        return await USER.find({_id:{"$ne":id},active:true}, {devices:1}).lean();

    }

    static async findOne(condition,projection) {
        return await USER.findOne(condition,projection).lean();
    }
}
module.exports = User;
