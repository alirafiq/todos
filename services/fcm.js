/**
 * Created by ali on 1/21/19.
 */
const users = require('../models/Users');
const request = require('request');

module.exports = class FCM {

    static async sendingMessage (id,msg){
        const user = await users.getAllToken(id);
        console.log("users",user)
        let deviceId = [];
        for (let devices of user) {
            for (let item of devices.devices) {
                deviceId.push(item.fcm_token);
                if (deviceId.length == 1000) {
                    FCM.processMsg(deviceId, msg);
                    deviceId = [];
                }
            }
        }
        FCM.processMsg(deviceId, msg);

    }
    static async processMsg(devices,msg) {
        request({
            url: 'https://fcm.googleapis.com/fcm/send',
            method: 'POST',
            headers: {
                'Content-Type' :' application/json',
                'Authorization': 'key=AAAAmN1vSP8:APA91bFb4lKgp2HJi3oXs3gdmBvspKeQ-l9myMutNooClUWBnqI9D1LK4ncq8GDRoKWUnpHM2bRK7MvBWa1jtZSodx5JdF7bS7BOj-6XvA5gfjI7LDHnBOLCh64unQxEYOdPuXCXpnQe'
            },
            body: JSON.stringify(
                { "data": {
                    "message": msg
                },
                    "registration_ids" : devices
                }
            )
        }, function(error, response, body) {
            if (error) {
                console.error(error, response, body);
            }
            else if (response.statusCode >= 400) {
                console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body);
            }
            else {
                console.log('Done!')
            }
        });

    }

}
