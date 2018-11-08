var express = require('express');
var router = express.Router();
var config = require("config")
var butter = require('buttercms')(config.get("buttercms.auth_token"));

router.get('', function(req, res, next) {
	butter.page.list("[[SLUG]]").then( (resp) => {
		res.render('[[SLUG]]', {links: resp.data.data});
	})
	.catch(console.err)
});


router.get('/:slug', function(req, res, next) {
	butter.page.retrieve("[[SLUG]]", req.params.slug).then( (resp) => {
		res.render(req.params.slug, resp.data.data);
	})
	.catch(console.err)
});


module.exports = router

