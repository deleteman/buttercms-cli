var express = require('express');
var router = express.Router();
var config = require("config")
var butter = require('buttercms')(config.get("buttercms.auth_token"));

router.get('/rss', function(req, res, next) {
  res.render('feeds', { title: 'RSS Feed' });
});

router.get('/atom', function(req, res, next) {
  res.render('feeds', { title: 'ATOM Feed' });
});


router.get('/:slug', function(req, res, next) {
	butter.post.retrieve(req.params.slug).then(function(response) {
	  console.log(response.data.data)
	  res.render('post', { post: response.data.data });
	}).catch(err => {
		res.render('error', {error: err})
	})
});

router.get('/', function(req, res, next) {
	butter.post.list({page: 1, page_size: 10}).then(function(response) {
	  console.log(response.data.data)
	  res.render('posts', { title: 'List of posts', posts: response.data.data });
	})
});


module.exports = router;
