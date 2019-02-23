
const Task = require("../models/task");

const Joi = require('joi');

const User = require("../models/user");


const mongoose = require('mongoose');

const earthradius = 6371
const pi = 3.14
let customerLat;
let customerLng;
let taskId;
function asignEng(fieldEngineer) {

    let distance = (2 * Math.asin(Math.sqrt(Math.pow(Math.sin((fieldEngineer.userLocation.latitude * (3.14 / 180) - customerLat) / 2), 2) + Math.cos(customerLat) * Math.cos(fieldEngineer.userLocation.latitude * (3.14 / 180)) * Math.pow(Math.sin((fieldEngineer.userLocation.longitude * (3.14 / 180) - customerLng) / 2), 2)))) * earthradius
    let field_id = fieldEngineer._id
    let result = [distance, field_id]
    return result;


    // console.log(min)
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
                return res.send(200).json({
                    task
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
            if (!result) { return res.boom.notFound('No idle field engineer found') }
            taskId = req.params.taskId;
            if (taskId == undefined || taskId == '' || taskId == null) {
                return res.boom.badRequest('taskID required');
            }
            Task.findById(taskId, (err, result) => {
                if (err) { req.boom.badRequest('Task Id not Found.'); }
                if (!result) { req.boom.notFound('Task not found.'); }
                customerLat = result.latitude;
                customerLng = result.longitude;
            })
            let assignEng = user_result.map(asignEng);
            user_result.queue.push(taskId);

        })
    }
}
