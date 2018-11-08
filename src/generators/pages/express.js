'use strict'

const {Command} = require('@oclif/command')
const inquirer = require("inquirer")
const OS = require("os")
const chalk  = require("chalk")
const fs = require("fs")
const BaseGenerator = require("../../common/baseGenerator")
const ButterCMS = require("buttercms")

const SOURCE_VIEW_PATH = __dirname + "/express-template/views/template.jade"
const SOURCE_ROUTE_PATH = __dirname + "/express-template/routes/template.js"

module.exports = class ExpressPagesGenerator extends BaseGenerator{

	constructor(page_type, auth_token) {
		super()
		this.page_type = page_type
		this.auth_token = auth_token
	}

	prompts() {
		this.log(`The following list of files will be created: 
${chalk.green(
	['Files:',
	 '- views/' + this.page_type + '.jade',
	 '- routes/' + this.page_type + '.js'

].join("\n")
)} 
Also the following routes will be availabe for you:
${chalk.green("- GET")} /${this.page_type}/
${chalk.green("- GET")} /${this.page_type}/:slug
`)

		return inquirer.prompt([{
				type: "confirm",
				name: "continue",
				message: "Are you sure you wish to continue?",
				choices: "Y/n",
				default: "Y"
			}])
			.then( answer => answer) 
			.catch( err => false)
	}

	
	printSuccessMessage() {
		this.log(chalk.green(`
== CONGRATS == 
Your new page has been created!
			`))
	}

	
	generateRouteFile( cb ) {
		fs.readFile(SOURCE_ROUTE_PATH, (err, content) => {
			if(err) return cb(err)
			let t  = content.toString().replace(/\[\[SLUG\]\]/gi, this.page_type)
			cb(null, t)
		})
	}
	
	/*
	copy the template files into the right folders, using the right names
	*/
	copyFiles(listOfPages) {

		let finalListViewName = './views/' + this.page_type + '.jade'
		let finalRouteName = './routes/' + this.page_type + '.js'


		fs.copyFile(SOURCE_VIEW_PATH, finalListViewName, (err) => {
			if(err) return this.log("There was a problem saving the view template for the list of pages: " + chalk.red(err.toString()))

			this.generateRouteFile( (err, routeContent) => {
				if(err) return this.log("Error while genreating route file: " + chalk.red(err.toString()))
				fs.writeFile(finalRouteName, routeContent, (err) => {
					if(err) { 
						return this.log("There was a problem copying the route template: " + chalk.red(err.toString()))
					}
					this.printSuccessMessage();
				})
			})
		})
	}

	/*
	Return the list of pages of the associated type
	*/
	getList(cb) {

		let butterClient = new ButterCMS(this.auth_token)
		butterClient.page.list(this.page_type).then( resp => {
			cb(null, resp.data.data);
		}).catch(cb)
	}

	execute(answer) {
		if(!answer.continue){
			return this.log("OK then, see you later!")
		}

		this.getList( (err, listOfPages) => {
			if(err) {
				return this.log("There was a problem getting the data for your page: " + chalk.red(err.toString()))
			}
			this.copyFiles(listOfPages)
		})

	}

}