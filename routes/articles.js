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
router.get('/:articles_id/comments', function (req, res, next) {
    const slug = req.params.articles_id;
    models.Comments.find({ belongs_to: slug })
        .then((commentsForArticles) => {
            if (commentsForArticles.length < 1) {
                return next({ status: 404, message: 'Articles not found' });
            }
            res.status(200).json({ commentsForArticles });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return next({status: 422, message: 'Invalid Id'});
            }
            next(err);
        });
});

module.exports = router;