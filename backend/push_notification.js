//using FCM-NODE module

exports.pushNotify = function (payloadMulticast) {

    var FCM = require('fcm-node');
    var serverKey = 'AIzaSyBmW5-4cW8XSbchf2alaEVSA0PSQbkS0Ug'; //put your server key here
    var fcm = new FCM(serverKey);

    fcm.send(payloadMulticast, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
            return false
        } else {
            console.log("Successfully sent with response: ", response);
            return true;
        }
    });
};


