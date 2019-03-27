//const bcrypt = require("bcrypt");
const User = require("../../../models/user");
const crypto = require('crypto');
const Joi = require('joi');

const signup = (req, res, next) => {
	try {
		const result = Joi.validate(req.body, Joi.object().keys({
			name: Joi.string().regex(/[a-zA-Z]/).required(),
			emailAddress: Joi.string().email().required().error(new Error(res.__('INVALID_EMAIL'))),
			password: Joi.string().regex(/^[a-zA-Z0-9]/).required().error(new Error(res.__('INVALID_PASSWORD_FORMAT'))),
			userCode: Joi.string().valid('field', 'support').required().error(new Error(res.__('USER_MUST_FIELD_OR_SUPPORT'))),
			
		}));

		if (result.error) { return res.boom.badRequest(result.error); }

		User.findOne({
			emailAddress: req.body.emailAddress
		}, (err, user) => {
			if (err) { return res.boom.badRequest(err); }
			if (user) { return res.boom.notFound(res.__('EMAIL_EXISTS')); }


			User.create({

				emailAddress: req.body.emailAddress,

				password: req.body.password,

				name: req.body.name,

				userCode: req.body.userCode,

				createdAt: new Date()
			}, (err, results) => {
				if (err) { return res.boom.badRequest(err); }

				if (req.body.userCode == 'field') {

				
					
					return res.status(200).json({
						results: {
							f_id: results._id,
							userCode: req.body.userCode,
							name: req.body.name,
							emailAddress: req.body.emailAddress
						},
						statusCode: 200

					});
				}

				if (req.body.userCode == 'support') {
					return res.status(200).json({

						results: {
							s_id: results._id,
							userCode: req.body.userCode,
							name: req.body.name,
							emailAddress: req.body.emailAddress
						},
						statusCode: 200

					});
				}


			});

		});
	} catch (error) {
		return res.boom.badRequest(error);
	}
};

module.exports = signup;