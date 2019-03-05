
const Task = require("../models/task");

const Joi = require('joi');

const User = require("../models/user");


const mongoose = require('mongoose');

const earthradius = 6371
const pi = 3.14
let customerLat;
let customerLng;
let taskId;

function sum(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum = sum + data[i]['min']
    }
    return sum
}

function assignEng(fieldEngineer) {

    let distance;
    let q_a = [];
    let field_id = fieldEngineer._id

    distance = (2 * Math.asin(Math.sqrt(Math.pow(Math.sin((fieldEngineer.userLocation.latitude * (3.14 / 180) - customerLat) / 2), 2) + Math.cos(customerLat) * Math.cos(fieldEngineer.userLocation.latitude * (3.14 / 180)) * Math.pow(Math.sin((fieldEngineer.userLocation.longitude * (3.14 / 180) - customerLng) / 2), 2)))) * earthradius

    q_a.push(sum(fieldEngineer.taskQueue))

    distance = parseInt(distance) + parseInt(q_a)

    let result = [distance, field_id]
    return result;

}

module.exports = {
    postNewTask: (req, res, next) => {
        try {
            const result = Joi.validate(req.body, Joi.object().keys({
                custName: Joi.string().regex(/[a-zA-Z]/).required(),
                latitude: Joi.string().required(),
                longitude: Joi.string().required(),
                reqTime: Joi.string().required()

            }));
            if (result.error) { return res.boom.badRequest(result.error); }

            Task.create({
                custName: req.body.custName,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                reqTime: req.body.reqTime
            }, (err, task) => {
                if (err) { return res.boom.badRequest(); }
                return res.status(200).json({
                    task: task
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
            Task.findById(taskId, async (err, task_result) => {
                if (err) { req.boom.badRequest('Task Id not Found.'); }
                if (!task_result) { req.boom.notFound('Task not found.'); }
                customerLat = task_result.latitude;
                customerLng = task_result.longitude;

                let distance = user_result.map(assignEng);
                console.log('DIStaan', distance)
                let min = distance[0][0];
                let min_user_id;

                for (let i = 0; i < distance.length; i++) {

                    new_min = distance[i][0]
                    min_user_id = distance[0][1]
                    if (new_min < min) {
                        min = new_min
                        min_user_id = distance[i][1]
                    }
                }

                User.findById(min_user_id, (err, result) => {
                    if (err) { return res.boom.badRequest(err); }
                    if (!result) { return res.boom.notFound() }
                    result.taskQueue.push({ taskId, min });
                    if (result.taskQueue.length == 3) {
                        result.userLocation.status = 'Buzy' //SET ENG TO BUZY STATE, ONCE QUEUE FULL WITH 3 TASK
                    }
                    result.save()
                    return res.status(200).json({
                        results:
                        {
                            taskId: taskId,
                            fieldEngineer: result.name
                        }
                    })
                })
            })
        })
    }
}
