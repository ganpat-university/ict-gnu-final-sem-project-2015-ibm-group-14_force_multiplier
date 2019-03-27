const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const userSchema = mongoose.Schema({

	name: {
		type: String,
		required: true
	},
	emailAddress: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	userCode: {
		type: String,
		required: true,
	},
	taskQueue:
		[
			{
				taskId: {
					type: Schema.ObjectId, ref: 'task'
				},

				min: { type: Number }
			}
		],


	userLocation: {
		latitude: { type: String },
		longitude: { type: String },
		status: { type: String },

	},
	deviceId: {
		type: String
	},

	createdAt: {
		type: Date,
		default: new Date()
	}
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("user", userSchema);