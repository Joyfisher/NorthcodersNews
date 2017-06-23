const router = require('express').Router();
// const mongoose = require('mongoose');
const models = require('../models/models');
// const {map} = require('bluebird');

router.get('/', function (req, res) {
    models.Topics.find()
        .then((topics) => {
            return res.status(200).json({ topics });
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
});
router.get('/:topic_id/articles', function (req, res, next) {
    const slug = req.params.topic_id;
    models.Articles.find({ belongs_to: slug })
        .then((articlesByTopic) => {
            if (articlesByTopic.length < 1) {
                return next({ status: 404, message: 'Topic not found' });
            }
            res.status(200).json({ articlesByTopic });
        })
        .catch(next);
});

module.exports = router;