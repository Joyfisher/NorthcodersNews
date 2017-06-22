const router = require('express').Router();

router.get('/', function (req, res) {
res.send('You\'ve found comments!');
});

module.exports = router;