
const User = require("../../../models/user");

const Joi = require('joi');
const mongoose = require('mongoose');

module.exports = {
    postFieldEngineerLocation: (req, res, next) => {
        try {
            const result = Joi.validate(req.body, Joi.object().keys({
                //name: Joi.string().regex(/[a-zA-Z]/).required(),
                //emailAddress: Joi.string().email().required().error(new Error(res.__('INVALID_EMAIL'))),

                latitude: Joi.string().required(),
                longitude: Joi.string().required(),
                status: Joi.string().valid('Busy', 'Idle').required().error(new Error(res.__('USER_STATUS_MUST_BUZY_OR_IDLE'))),

            }));


            if (result.error) { return res.boom.badRequest(result.error); }

            User.findById(mongoose.Types.ObjectId(req.userData.userId), (err, results) => {
                if (err) { return res.boom.badRequest(err); }
                if (!results) { return res.boom.notFound(res.__('USER_NOT_FOUND')); }


                results.userLocation.latitude = req.body.latitude,
                    results.userLocation.latitude = req.body.latitude,
                    results.userLocation.longitude = req.body.longitude,
                    results.userLocation.status = req.body.status

                results.save();

                return res.status(200).json({
                    results: {
                        f_id: results._id,
                        emailAddress: results.emailAddress,
                        status: req.body.status,
                        latitude: req.body.latitude,
                        longitude: req.body.longitude
                    },
                    statusCode: 200
                }
                );

            });

        }
        catch (error) {
            return res.boom.badRequest(error);
        }
    },
    getfieldengdata: (req, res) => {
        let userId = req.params.userId;

        User.findById(req.params.userId, "-password -__v -taskQueue.min").populate({
            path: 'taskQueue.taskId'

        }).exec((err, result) => {
            let taskQueue = [];
            for(let task of result.taskQueue){
                
            taskQueue.push(task.taskId)
            }
            return res.status(200).json({
                results:
                {
                    user: {
                        userLocation: result.userLocation,
                        name: result.name,
                        emailAddress: result.emailAddress,
                        userCode: result.userCode
                    },
                    taskQueue:
                        taskQueue
                }

            })
        })
    }
}