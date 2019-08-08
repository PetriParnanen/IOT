const express = require('express');
const Iotdata = require('../models/Iotdata');

const router = express.Router();

router.post("/", (req,res) => {
	Iotdata.distinct('device')
		.then(devices => res.json({ devices }))
		.catch(err => res.status(400).json({ errors: "Something went wrong" }));
});

router.post("/find", (req,res) => {
	Iotdata.find( {
		device: req.body.data.device, 
		time:{ 
			$gte: req.body.data.startDate, 
			$lte: req.body.data.endDate 
		}
	})
		.then(values => res.json({ values }))
		.catch(err => res.status(400).json({ errors: "Something went wrong"}));
});

module.exports = router;