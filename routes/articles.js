const router = require('express').Router();
const models = require('../models/models');

router.get('/', function (req, res) {
    models.Articles.find()
        .then((articles) => {
            return res.status(200).json({ articles });
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
});

module.exports = router;