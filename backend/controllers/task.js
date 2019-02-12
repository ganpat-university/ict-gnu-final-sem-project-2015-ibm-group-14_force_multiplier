const User = require("../models/user");
const Task = require("../models/task");

const Joi = require('joi');
const mongoose = require('mongoose');
const earthradius = 6371
const pi = 3.14
let customerLat;
let customerLng;

function nearestEng(fieldEngineer) {
    //return fieldEngineer.userLocation
    distance = (2 * Math.asin(Math.sqrt(Math.pow(Math.sin((fieldEngineer.userLocation.latitude * (3.14 / 180) - customerLat) / 2), 2) + Math.cos(customerLat) * Math.cos(fieldEngineer.userLocation.latitude * (3.14 / 180)) * Math.pow(Math.sin((fieldEngineer.userLocation.longitude * (3.14 / 180) - customerLng) / 2), 2)))) * earthradius 
    field_id = fieldEngineer._id
    result = [distance , field_id]
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
            }));


            if (result.error) { return res.boom.badRequest(result.error); }

            Task.create({
                custName: req.body.custName,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }, (err, results) => {
                if (err) { return res.boom.badRequest(err); }

                customerLat = req.body.latitude * (3.14 / 180);
                customerLng = req.body.longitude * (3.14 / 180);

                User.find({ userCode: 'field', 'userLocation.status': 'Idle' }, (err, result) => {
                     let assigEng = result.map(nearestEng)
                     console.log(assigEng)


                })

                return res.status(200).json({

                    statusCode: 200
                }
                );

            });

        }
        catch (error) {
            return res.boom.badRequest(error);
        }
    },

    getTaskWithAssignedEngineer: (req, res) => {
        User.find((err, result) => {
            console.log('ALL USERS', result);
        })
    }
}

