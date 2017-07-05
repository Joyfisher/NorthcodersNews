const router = require('express').Router();
const models = require('../models/models');
const Articles = require('../models/articles');
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

router.put('/:article_id', function (req, res) {
        const {article_id} = req.params;

    let vote = req.query.vote;
    let query;

    Articles.findById(article_id)
        .then((article) => {
            if (article.votes <= 0 && vote === 'down') {
                return res.status(200).json({ article });
            }
            if (vote === 'up') query = { $inc: { votes: 1 } };
            if (vote === 'down') query = { $inc: { votes: -1 } };

            return Articles.findByIdAndUpdate({ _id: article_id }, query, { new: true })
                .then((article) => {
                    res.status(200).json({ article });
                });
        }).catch((err) => {
            res.status(500).json(err);
        });
}
);

module.exports = router;