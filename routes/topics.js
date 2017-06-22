const router = require('express').Router();
// const mongoose = require('mongoose');
const models = require('../models/models');

router.get('/', function (req, res) {
    models.Topics.find()
        .then((topics) => {
            return res.status(200).json({ topics });
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
});

module.exports = router;