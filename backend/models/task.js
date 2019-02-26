const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const taskSchema = mongoose.Schema({

	custName: {
		type: String,
		required: true
	},
	latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
	taskStatus: {
        type: String,
        default: 'InProgress'
    },
    field_id: {
        type: String
    },
    reqTime: {
        type: Number
    },
	createdAt: {
		type: Date,
		default: new Date()
	}
});

taskSchema.plugin(uniqueValidator);
module.exports = mongoose.model("task", taskSchema,'task');