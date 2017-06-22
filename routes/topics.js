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
// map over topics and return all the articles for that topic
router.get('/:topic_id/articles', function (req, res) {
    // get the topic id from request object
    const slug = req.params.topic_id;
    // Find all articles that belong_to === topic.slug
    models.Articles.find({belongs_to : slug})
    .then((articlesByTopic) => {
        return res.status(200).json({articlesByTopic});
    })
    .catch((err) => {
        return res.status(404).json(err);
    });
    
});

module.exports = router;