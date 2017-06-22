const router = require('express').Router();

router.get('/', function (req, res) {
res.send('You\'ve found articles!');
});

module.exports = router;