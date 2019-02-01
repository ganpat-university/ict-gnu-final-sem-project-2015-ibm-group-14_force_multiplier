const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const User = require("../../../models/user");

const login = (req, res, next) => {
	try {
		const result = Joi.validate(req.body, Joi.object().keys({
			emailAddress: Joi.string().email().required().error(new Error(res.__('INVALID_EMAIL'))),
			password: Joi.string().regex(/^[a-zA-Z0-9]/).required().error(new Error(res.__('INVALID_PASSWORD_FORMAT')))
		}));

		if (result.error) { return res.boom.badRequest(result.error); }

		User.findOne({
			emailAddress: req.body.emailAddress,

		}, (err, results) => {
				if (err) { return res.boom.badRequest(err); }
				if (!results) { return res.boom.notFound(res.__('USER_NOT_FOUND')); }

				if(results.password == req.body.password) {
					
					


					const token = jwt.sign({
						emailAddress: results.emailAddress,
						userId: results._id
					}, global.gConfig.secret_key, { expiresIn: "7d" });

					if (results.userCode == 'field') {
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
								name: results.name
								
							},
							statusCode: 200
						});
					}
				}
				else {
					return res.boom.unauthorized(res.__('INVALID_PASSWORD'));
				}
			});

	} catch (error) {
		return res.boom.badRequest(error);
	}
};

module.exports = login;