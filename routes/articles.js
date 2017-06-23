const router = require('express').Router();
const models = require('../models/models');
// const bodyParser = require('body-parser');

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
                return next({ status: 422, message: 'Invalid Id' });
            }
            next(err);
        });
});
router.post('/:articles_id/comments', function (req, res, next) {
    // add comment to article
    let newComment = new models.Comments({
        body: req.body.body,
        belongs_to: req.params.articles_id
    });
    newComment.save()
        .then((newComment) => {
            res.json(201, { comment: newComment });
        })
        .catch((err) => {
            console.log(err);
            if (err.name === 'CastError') {
                return next({ status: 422, message: 'Incorrect/Invalid ID' });
            }
            next(err);
        });
});

module.exports = router;