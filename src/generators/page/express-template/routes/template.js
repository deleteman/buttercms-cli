var express = require('express');
var router = express.Router();
var config = require("config")
var butter = require('buttercms')(config.get("buttercms.auth_token"));

router.get('', function(req, res, next) {
	butter.page.retrieve("*", "[[SLUG]]").then( (resp) => {
		res.render('[[SLUG]]', resp.data.data);
	})
	.catch(console.err)
});


module.exports = router

