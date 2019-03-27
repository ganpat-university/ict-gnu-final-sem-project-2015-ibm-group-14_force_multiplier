//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const User = require("../../../models/user");

const login = (req, res, next) => {
	try {
		const result = Joi.validate(req.body, Joi.object().keys({
			emailAddress: Joi.string().email().required().error(new Error(res.__('INVALID_EMAIL'))),
			password: Joi.string().regex(/^[a-zA-Z0-9]/).required().error(new Error(res.__('INVALID_PASSWORD_FORMAT'))),
			deviceId: Joi.string()
		}));

		if (result.error) {
			return res.boom.badRequest(result.error);
		}

		User.findOne({
			emailAddress: req.body.emailAddress,

		}, (err, results) => {
			console.log(results);
			if (!results) {
				return res.boom.notFound(res.__('USER_NOT_FOUND'));
			}
			if (err) {
				return res.boom.badRequest(err);
			}


			if (results.password != req.body.password) {
				return res.boom.unauthorized(res.__('INVALID_PASSWORD'));
			}

			if (req.body.deviceId == null || req.body.deviceId == undefined || req.body.deviceId == '') {
				return res.boom.badRequest('DeviceId required for push notification.')
			}

			const token = jwt.sign({
				emailAddress: results.emailAddress,
				userId: results._id,
				userCode: results.userCode

			}, global.gConfig.secret_key, {
				expiresIn: "7d"
			});

			if (results.userCode == 'field') {
				results.deviceId = req.body.deviceId;
				results.save();
				return res.status(200).json({
					results: {
						f_id: results._id,
						userCode: results.userCode,
						emailAddress: results.emailAddress,
						name: results.name,
						accessToken: token
					},
					statusCode: 200
				});
			}
			if (results.userCode == 'support') {
				return res.status(200).json({

					results: {
						s_id: results._id,
						userCode: results.userCode,
						emailAddress: results.emailAddress,
						name: results.name,
						accessToken: token

					},
					statusCode: 200
				});
			}


		});

	} catch (error) {
		return res.boom.badRequest(error);
	}
};

module.exports = login;