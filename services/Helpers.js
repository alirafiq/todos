/**
 * Created by ali on 5/23/18.
 */
const _crypto = require('crypto');
const  fs= require('fs');
const  request= require('request');
const  nodemailer = require('nodemailer');
const  mongoose  = require("mongoose");


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://mdl.flowy@gmail.com:khilhr786@smtp.gmail.com');

const helper = {
    checkAttachment:function(req,callBack){
        var image = '';
        if (req.files) {
            var image = false;
            var file = req.files;
            for (var k in file) {
                if (k.fieldname) {
                    image = k;
                    break;
                }
                if (typeof file[k] == 'object') {
                    for (var key in file[k]) {

                        image = file[k];
                        break;
                    }
                }
            }
            if (image) {

                var fileName = new Date().getTime() + "." + image.originalname.split('.').pop();
                fs.rename(image.path, image.path + fileName, function (err) {
                    if (err) callBack(false);
                    callBack((image.path).replace("public", '') + fileName)
                });

            } else {
                callBack(false)

            }
        } else {
            callBack(false)

        }

    },
    uploadImagebyName:function(req,fileN,callBack){
        console.log(JSON.stringify(req.files))
        var image = '';
        if (req.files) {
            var image = false;
            var file = req.files;
            for (var k in file) {
                if (file[k].fieldname == fileN) {
                    image = file[k];
                    break;
                }
            }
            console.log(image)
            if (image) {
                var fileName = new Date().getTime() + "." + image.originalname.split('.').pop();
                fs.rename(image.path, image.path + fileName, function (err) {
                    if (err) {
                        callBack(false);
                    }
                    else {
                        console.log(fileName)
                        callBack((image.path).replace("public", '') + fileName)
                    }
                });

            } else {
                callBack(false)

            }
        } else {
            callBack(false)
        }
    },
    forgotPassword:function(user,server,code){


        var content = '';

        var date = new Date();
        content = '<html><div style="text-align:left";><div style="background-color: #e8e8e8;width: 80%;">';
        content += '<a href="#"><div style="width: 100%; background-color: #eeeeee;font-weight: bold;font-size: 36px; text-align: center">Forgot Password</div></a>';
        content += '<br/>';
        content += '<br/>';
        content += '<br/>';
        content += '<table width="80%" style="margin-left: 5%;">';
        content += '<tr>';
        content += '<td colspan="2">';
        content += '<span style="font-weight: Bold;color: #2e2e2e">Dear '+user.name+',</span>';
        content += '<br/>';
        content += '<br/>';
        content += '<br/>';
        content += '</td></tr>';
        content += '<tr><td colspan="2">';
        content += '<span style="float:left;color: #2e2e2e">Your request to change password, Email Code is given below<br/><br/></span></td>';
        content += '</tr>';
        content += '<tr>';
        content += '<td width="20%">';
        content += "<b> Code : </b>";
        content += '</td>';
        content += '<td >';
        content += '<b><a href="http://'+server+'/changepassword/'+user.code+'" target="_blank">Click Here</a></b>';
        content += '</td></tr>';
        content += '</table>';

        content += '<br/>';
        content += '<br/>';
        content += '<span style="font-weight: Bold;color: #2e2e2e;margin-left: 5%;">Best Regards,</span>';
        content += '<br/>';
        content += '<span style="font-weight: Bold;color: #2e2e2e;margin-left: 5%;">Support</span>';
        content += '<br/>';
        content += '<br/>';
        content += '<br/>';
        content +=   '<div style="border-bottom:1px solid;"><div>';
        content += '<br/>';

        content +=   '<div style="float: right;">©</div></html>';

// setup e-mail data with unicode symbols
        var mailOptions = {
            from: 'Todo', // sender address
            to: user.email, // list of receivers
            subject: 'Forgot Password ', // Subject line
            text: '', // plaintext body
            html: content // html body
        };

// send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

    },
    encrypt: (text)=>{
        var masterkey  = 'poiuytrewqlkjhgfdsa';
        // random initialization vector
        const iv = _crypto.randomBytes(16);

        // random salt
        const salt = _crypto.randomBytes(64);

        // derive key: 32 byte key length - in assumption the masterkey is a cryptographic and NOT a password there is no need for
        // a large number of iterations. It may can replaced by HKDF
        const key = _crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');

        // AES 256 GCM Mode
        const cipher = _crypto.createCipheriv('aes-256-gcm', key, iv);

        // encrypt the given text
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

        // extract the auth tag
        const tag = cipher.getAuthTag();

        // generate output
        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
    },
    decrypt: (data)=>{
        var masterkey  = 'poiuytrewqlkjhgfdsa';

        // base64 decoding
        const bData = new Buffer(data, 'base64');

        // convert data to buffers
        const salt = bData.slice(0, 64);
        const iv = bData.slice(64, 80);
        const tag = bData.slice(80, 96);
        const text = bData.slice(96);

        // derive key using; 32 byte key length
        const key = _crypto.pbkdf2Sync(masterkey, salt , 2145, 32, 'sha512');

        // AES 256 GCM Mode
        const decipher = _crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);

        // encrypt the given text
        const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');

        return decrypted;
    },
    md5: (data)=>{
       return  _crypto.createHash('md5').update(data).digest("hex");
    },
    ObjectId:(id)=>{
        try{
            return mongoose.types.ObjectId(id)
        }catch(e){

            return ''
        }
    }
}

module.exports = helper;
