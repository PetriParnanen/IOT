const mongoose = require('mongoose');

var schema = new mongoose.Schema({
	device: String,
	value: Number,
	unit: String,
	topic: String,
	time: Date,
	reqid: Number,
	measurement: String
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Iotdata', schema);