var express = require('express');
var router = express.Router();

router.get('/:slug', function(req, res, next) {
  res.render('authors', { title: 'List of authors' });
});

module.exports = router;
