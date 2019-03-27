
const Task = require("../models/task");

const Joi = require('joi');

const User = require("../models/user");

const pushNotify = require("../push_notification")
const mongoose = require('mongoose');

const earthradius = 6371
const pi = 3.14
let customerLat;
let customerLng;
let taskId;

function sum(data) {
    let sum = 0;
    if (data.length <= 0) { return sum; }
    for (let i = 0; i < data.length; i++) {
        sum = sum + data[i]['min']
    }
    return sum
}

function assignEng(fieldEngineer) {

    let distance;
    let q_a;
    let field_id = fieldEngineer._id

    distance = (2 * Math.asin(Math.sqrt(Math.pow(Math.sin((fieldEngineer.userLocation.latitude * (3.14 / 180) - customerLat) / 2), 2) + Math.cos(customerLat) * Math.cos(fieldEngineer.userLocation.latitude * (3.14 / 180)) * Math.pow(Math.sin((fieldEngineer.userLocation.longitude * (3.14 / 180) - customerLng) / 2), 2)))) * earthradius
    q_a = sum(fieldEngineer.taskQueue)

    console.log(q_a)
    timeToTravelEachEng = parseInt(distance / 40) + parseInt(q_a)

    let result = [timeToTravelEachEng, field_id]
    return result;

}

module.exports = {
    postNewTask: (req, res, next) => {
        try {
            const result = Joi.validate(req.body, Joi.object().keys({
                custName: Joi.string().regex(/[a-zA-Z]/).required(),
                description: Joi.string().required(),
                latitude: Joi.string().required(),
                longitude: Joi.string().required(),
                reqTime: Joi.string().required()

            }));
            if (result.error) { return res.boom.badRequest(result.error); }

            Task.create({
                custName: req.body.custName,
                description: req.body.description,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                reqTime: req.body.reqTime,

            }, (err, task) => {
                if (err) { return res.boom.badRequest(); }
                User.find({ userCode: 'field' }, "deviceId -_id", (err, user_result) => {

                    let temp = user_result.map((data) => {
                        return data.deviceId;
                    });
                    var payloadMulticast = {
                        registration_ids: temp,
                        // data: {
                        //     url: "news"
                        // },
                        priority: 'high',
                        content_available: true,
                        notification: { title: 'Hello Engineer', body: 'New task created.', sound: "default", badge: "1" }
                    };
                    pushNotify.pushNotify(payloadMulticast);
                    return res.status(200).json({
                        task: task
                    })
                })

            });
        }
        catch (error) {
            return res.boom.badRequest(error);
        }
    },

    assignEng: (req, res) => {
        User.find({ userCode: 'field', 'userLocation.status': 'Idle' }, (err, user_result) => {

            if (err) { return res.boom.badRequest(err); }
            if (!user_result || user_result.length == 0 || user_result == undefined || user_result == null) { return res.boom.notFound('No idle field engineer found') }
            //console.log(user_result)

            taskId = req.params.taskId;
            if (taskId == undefined || taskId == '' || taskId == null) {
                return res.boom.badRequest('taskID required');
            }
            Task.findOne({ '_id': taskId, 'taskStatus': 'Pending' }, (err, task_result) => {
                if (err) { return res.boom.badRequest('Task Id not Found.'); }
                if (!task_result) { return res.boom.notFound('NO pending task found.'); }
                customerLat = task_result.latitude;
                customerLng = task_result.longitude;

                let timeToTravelEachEng = user_result.map(assignEng);
                //console.log('DIStaan', timeToTravelEachEng)
                let min = timeToTravelEachEng[0][0];
                let min_user_id;

                for (let i = 0; i < timeToTravelEachEng.length; i++) {

                    new_min = timeToTravelEachEng[i][0]
                    min_user_id = timeToTravelEachEng[0][1]
                    if (new_min < min) {
                        min = new_min
                        min_user_id = timeToTravelEachEng[i][1]
                    }
                }
                task_result.taskStatus = 'InProgress';
                task_result.save();
                User.findById(min_user_id, (err, user_result) => {
                    if (err) { return res.boom.badRequest(err); }
                    if (!user_result) { return res.boom.notFound() }
                    user_result.taskQueue.push({ taskId, min });
                    if (user_result.taskQueue.length == 3) {
                        user_result.userLocation.status = 'Buzy' //SET ENG TO BUZY STATE, ONCE QUEUE FULL WITH 3 TASK
                    }
                    user_result.save();
                    var payloadMulticast = {
                        registration_ids: [ user_result.deviceId ],
                        // data: {
                        //     url: "news"
                        // },
                        priority: 'high',
                        content_available: true,
                        notification: { title: 'Hello Engineer', body: 'New Task Assigned to you.', sound: "default", badge: "1" }
                    };
                    let confirmation = pushNotify.pushNotify(payloadMulticast); //true | false


                    return res.status(200).json({
                        results:
                        {
                            taskId: taskId,
                            fieldEngineer: user_result.name
                        }
                    })
                })
            })
        })
    },
    checkout: (req, res) => {
        let taskId = req.params.taskId
        Task.findOne({ '_id': taskId, 'taskStatus': 'InProgress' }, (err, task_result) => {
            if (err) { return res.boom.badRequest('Task Id not Found.'); }
            if (!task_result) { return res.boom.notFound('Not Found'); }

            task_result.taskStatus = "Completed";
            task_result.save();
            User.findById(req.userData.userId, (err, result) => {
                let count = 0;
                if (err) { return res.boom.badRequest(err); }
                if (!result) { return res.boom.notFound() }

                let SubtractionValue;
                for (let i = 0; i < result.taskQueue.length; i++) {

                    if (result.taskQueue[i].taskId == req.params.taskId) {
                        SubtractionValue = result.taskQueue[i].min
                        result.taskQueue.splice(i, 1)
                    }
                }
                for (let i = 0; i < result.taskQueue.length; i++) {  //TO SUBTRACT THE TASK COMPLITION MIN VALUE FROM EACH TASK IN QUEUE, DUE TO DEPENDECY TO OTHER TASKS MIN VALUE
                    result.taskQueue[i].min -= SubtractionValue;
                }
                result.userLocation.status = 'Idle' //SET ENG TO BUZY STATE, ONCE QUEUE FULL WITH 3 TASK
                result.save();
                count = 0;
                return res.status(200).json({
                    results:
                        result
                })
            })

        })

    }
}
