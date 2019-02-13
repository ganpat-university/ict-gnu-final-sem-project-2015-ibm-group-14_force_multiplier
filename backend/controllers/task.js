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
            }));


            if (result.error) { return res.boom.badRequest(result.error); }

            Task.create({
                custName: req.body.custName,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }, (err, task) => {
                if (err) { return res.boom.badRequest(err); }
                customerLat = req.body.latitude * (3.14 / 180);
                customerLng = req.body.longitude * (3.14 / 180);

                User.find({ userCode: 'field', 'userLocation.status': 'Idle' } , (err, result) => {
                    console.log('result',result);
                    if (err) { return res.boom.badRequest(err); }
                    if (!result) { return res.boom.notFound('No idle field engineer found') }
                    if (result == '') { return res.boom.notFound('Task has been created, but no idle field engineer found to assign your task') }
                    let assigEng = result.map(nearestEng)
                    let min = assigEng[0][0]
                    let field_id;
                    for (i = 0; i < assigEng.length; i++) {

                        if (assigEng[i][0] <= min) {
                            min = assigEng[i][0]
                            field_id = assigEng[i][1];
                        }
                    }
                    console.log(assigEng);
                    User.findById(mongoose.Types.ObjectId(field_id), (err, result) => {
                        result.userLocation.status = 'Busy'
                        result.save();
                        task.field_id = field_id;
                        task.save()
                        return res.status(200).json({
                            result: {
                                fieldEngineerName: result.name,
                                distance: min
                            },
                            statusCode: 200
                        }
                        );
                    });
                })
            });
        }
        catch (error) {
            return res.boom.badRequest(error);
        }
    },

  //  getAssignedEngineer: (req,res) => {
 //       
  //  }

}

