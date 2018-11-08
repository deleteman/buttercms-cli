'use strict'

const {Command} = require('@oclif/command')
const inquirer = require("inquirer")
const chalk  = require("chalk")
const fs = require("fs")
const ncp = require("ncp").ncp
const BaseGenerator = require("../../common/baseGenerator")

const SOURCEEXPRESSBLOG = __dirname + "/express-template"

module.exports = class ExpressBlogGenerator extends BaseGenerator{

	constructor(auth_token) {
		super()
		this.auth_token = auth_token
	}

	prompts() {
		this.log(`The following list of files will be created: 
${chalk.green(
	['app',
   	'- /public/javascripts/',
   	'- /public/images/',
   	'- /public/stylesheets/',
   	'- /public/stylesheets/style.css',
   	' ',
   	'- /routes/index.js',
   	'- /routes/authors.js',
   	'- /routes/categories.js',
   	'- /routes/blog.js',
   	' ',

   	'- /views/error.jade',
   	'- /views/index.jade',
   	'- /views/layout.jade',
   	'- /views/authors.jade',
   	'- /views/categories.jade',
   	'- /views/feeds.jade',
   	'- /views/posts.jade',
   	'- /views/post.jade',

   	' ',
   	'- /app.js',
   	'- /package.json',
   	'- /bin/www'
].join("\n")
)} 
Also the following routes will be availabe for you:
${chalk.green("- GET")} /categories/:slug
${chalk.green("- GET")} /authors/:slug

${chalk.green("- GET")} /blog/rss
${chalk.green("- GET")} /blog/atom

${chalk.green("- GET")} /blog/pages/:page
${chalk.green("- GET")} /blog
${chalk.green("- GET")} /blog/:slug
`)

		return inquirer.prompt([{
				type: "confirm",
				name: "continue",
				message: "Are you sure you wish to continue?",
				choices: "Y/n",
				default: "Y"
			},{
				when: response => response.continue,
				type: "string",
				name: "appname",
				message: "What's the name of your blog?"
			}])
			.then( answer => answer) 
			.catch( err => false)
	}

	cleanAppName(appname) {
		return appname.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g,"")
	}

	printSuccessMessage(folderName) {
		this.log(chalk.green(`
== CONGRATS == 
Your blog is ready for you to start pumping code into it!

Now you can:
1- cd ./${folderName}
2- npm install
3- npm start 
			`))
	}
	
	/*
	Create the destination folder using the application name given,
	and copy the blog files into it
	*/
	copyFiles(appname) {
		const folderName = this.cleanAppName(appname)
		fs.mkdir(folderName, (err) => { //create the new folder
			if(err) { 
				return this.log("There was a problem creating your blog's folder: " + chalk.red(err.toString()))
			}
			this.log("Folder - " + chalk.bold(folderName) + " -  " + chalk.green("successfully created!"))
			ncp(SOURCEEXPRESSBLOG, folderName, (err) => { //copy all files
				if(err) {
					return this.log("There was a problem while copying your files: " + chalk.red(err))
				}
				let configFilePath = folderName + "/config/default.json"
				fs.readFile(configFilePath, (err, configContent) => { //overwrite the configuration file, with the provided AUTH KEY
					let newConfig = configContent.toString().replace("<your token>", this.auth_token)
					fs.writeFile(configFilePath, newConfig, (err) => {
						this.printSuccessMessage(folderName)
					})
				})
			})
		})
	}

	execute(answer) {
		if(!answer.continue){
			return this.log("OK then, see you later!")
		}
		this.copyFiles(answer.appname)
	}

}