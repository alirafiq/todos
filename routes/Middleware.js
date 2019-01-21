const UserModel = require('../models/Users');

class Middleware {
    static authorization(req,res,next){
        let token;
        if(req.headers.auth_token){
           token =req.headers.auth_token;
        }
        if(token){

            UserModel.findOne({auth_token:token}).then((user)=>{
                req.user = user;
                next();
            }).catch(()=>{
                res.status(401);
                res.send({'status':false,'message':'unauhtorized','code':401});
            })

        }else{
            res.status(401);
            return res.send({'status':false,'message':'unauhtorized','code':401});

        }

    }
}
module.exports = Middleware;
