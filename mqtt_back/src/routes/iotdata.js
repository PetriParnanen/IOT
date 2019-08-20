const express = require('express');
const Iotdata = require('../models/Iotdata');

const router = express.Router();

router.post("/device", (req,res) => {
	Iotdata.distinct('device')
		.then(devices => res.json({ devices }))
		.catch(err => res.status(400).json({ errors: "Something went wrong" }));
});

router.post("/find", (req,res) => {
	Iotdata.find( {
		device: req.body.data.device,
		measurement: req.body.data.measurement, 
		time:{ 
			$gte: req.body.data.startDate, 
			$lte: req.body.data.endDate 
		}
	})
		.then(values => res.json({ values }))
		.catch(err => res.status(400).json({ errors: "Something went wrong" }));
});

router.post("/measure", (req,res) => {
	Iotdata.distinct('measurement', { device: req.body.device })
		.then(measurements => res.json({ measurements }))
		.catch(err => res.status(400).json({ errors: "something went wrong" }))
})

module.exports = router;