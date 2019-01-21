const UserModel = require('../models/Users');
const Helper = require('../services/Helpers');

class UserController {
    static async create(req, res) {
        try {
            console.log(req.body)
            if (req.body.email && req.body.password && req.body.name) {
                var newUser = {
                    email: req.body.email,
                    name: req.body.name,
                    password: Helper.encrypt(req.body.password),
                    code: '',
                    auth_token: Helper.encrypt(new Date().getTime().toString()),
                    fcm_token: ''
                }
                if (req.body.fcm_token) {
                    newUser.fcm_token = req.body.fcm_token;
                }
                const user = await UserModel.create(newUser);
                delete user.code;
                delete user.password;
                res.status(200)
                res.send({status: true, code: 200, message: "Successfully registed", user: user})


            } else {
                res.status(400)
                res.send({status: false, code: 400, message: "missing required parameter Email | Password | Name"})
            }
        } catch (e) {
            res.status(400)
            res.send({status: false, code: 400, message: "Email already Exist"})

        }
    }

    static async login(req, res) {
        try {
            if (req.body.email && req.body.password) {
                var query = {}
                query.email = req.body.email
                query.active = true

                let user = await UserModel.findOne(query);
                if (user) {
                    if (Helper.decrypt(user.password) == req.body.password) {
                        var updateObj = {
                            auth_token: Helper.encrypt(new Date().getTime().toString()),
                            ud: new Date()
                        }
                        if (req.body.fcm_token) {
                            updateObj.fcm_token = req.body.fcm_token;
                        }
                        user = await UserModel.findByIdAndUpdate(user._id, updateObj);
                        delete user.code;
                        delete user.password;
                        res.status(200);
                        res.send({status: true, code: 200, message: "Successfully login", user: user})

                    } else {
                        res.status(400)
                        res.send({status: false, code: 400, message: "Invalid Password"})

                    }
                } else {
                    res.status(400)
                    res.send({status: false, code: 400, message: "Error! Invalid Email or " + e})

                }

            } else {
                res.status(400)
                res.send({status: false, code: 400, message: "missing required parameter Email | Password "})
            }
        } catch (e) {
            console.log(e)
            res.status(400)
            res.send({status: false, code: 400, message: "Something wen wrong " + e})

        }
    }

    static async forgotPassword(req, res) {
        try {
            if (req.body.email) {
                let query = {}
                query.email = req.body.email
                query.active = true

                let user = await UserModel.findOne(query);
                var updateObj = {
                    code: Helper.md5(new Date().getTime().toString())
                }

                user = await UserModel.findByIdAndUpdate(user._id, updateObj);

                Helper.forgotPassword(user, req.headers.host, updateObj.code);
                res.status(200);
                res.send({status: true, code: 200, message: "Email has been sent!"})

            } else {
                res.status(400)
                res.send({status: false, code: 400, message: "missing required parameter Email "})
            }
        } catch (e) {
            res.status(400)
            res.send({status: false, code: 400, message: "Something wen wrong " + e})

        }
    }

    static async activation(req, res) {

        var query = {code: req.params.key}
        UserModel.findOne(code)
            .then((u) => {
                res.render('confirmation', {status: true, message: "Your account has been activated"})
            }).catch((e) => {
            res.render('confirmation', {status: false, message: "Invalid Activation key", role: ''})
        })
    }

    static async changepassword(req, res) {
        let query = {code: req.params.key}
        let user = await UserModel.findOne(query);
        if (user)
            res.render('changePassword', {status: true, msg: ""})
        else res.render('changePassword', {status: false, msg: "Invalid URL"})

    }

    static async updatePassword(req, res) {

        try {
            console.log("Body = " + JSON.stringify(req.body))

            if (req.body.password == req.body.confirm_password) {

                var password = Helper.encrypt(req.body.password.toString());
                var condition = {
                    code: req.params.key,
                }
                var query = {
                    code: Helper.md5(new Date().getTime().toString()),
                    password
                }


                const user = await UserModel.findOneAndUpdate(condition, query);
                if (user) {
                    res.render('changePassword', {
                        status: true,
                        msg: "Password has been changed successfully",
                        rescode: 200
                    });
                } else {
                    res.render('changePassword', {
                        status: false,
                        msg: "Invalid Code",
                        rescode: 400
                    })

                }
            } else {
                res.render('changePassword', {
                    status: true,
                    msg: "Confirm password not matched",
                    rescode: 400
                })

            }
        } catch (e) {
            console.log(e)
            res.render('changePassword', {
                status: true,
                msg: e.message,
                rescode: 400
            })


        }
    }
    static async update_token(req, res) {

        try {
            console.log("Body = " + JSON.stringify(req.body))

            if (req.body.fcm_token && req.body.platform) {

                var condition = {
                    _id: req.user._id,
                }


                const user = await UserModel.findOne(condition, {devices:1});
                if (user) {
                    if (!user.devices) {
                        user.devices = [];
                    }
                    let found = false;
                    for (let item of user.devices) {
                        if (item.platform==req.body.platform) {
                            found = true;
                            item.fcm_token = req.body.fcm_token;
                        }
                    }
                    if (!found) user.devices.push(req.body);
                    await UserModel.findByIdAndUpdate(user._id,user);
                    res.send({status:true});

                } else {
                    res.send(401,{status: false, code: 401, message: "UnAuthorized User"})

                }
            } else {
                res.send(400,{status: false, code: 400, message: "missing params"})

            }
        } catch (e) {
            res.send(500,{status: false, code: 500, message: e.message})

        }
    }
}
module.exports = UserController;
