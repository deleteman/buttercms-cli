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

module.exports = class ExpressPageGenerator extends BaseGenerator{

	constructor(page, auth_token) {
		super()
		this.page = page
		this.auth_token = auth_token
	}

	prompts() {
		this.log(`The following list of files will be created: 
${chalk.green(
	['views/' + this.page + '.jade',
	 'routes/' + this.page + '.js',

].join("\n")
)} 
Also the following routes will be availabe for you:
${chalk.green("- GET")} /blog/${this.page}
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

	guessRepresentation(fields, field, prefixValue) {
		if(!prefixValue) prefixValue = "fields"
		if(typeof fields[field] === 'boolean') {
			return '\tinput(type="checkbox"  checked=' + prefixValue + '.' + field +' name="' + field + '")' 
		}
		if(typeof fields[field] === 'string') {
			if(fields[field].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T/g)) {
				return '\tinput(type="datetime-local" value=' + prefixValue + '.' + field + ')'
			}
			if(fields[field].match(/<[a-z][\s\S]*>/i)) {
				return '\tp!=' + prefixValue + '.' + field
			}
		}
		
		if(fields[field].slug) {
			return '\ta(href="/" + ' + prefixValue + '.' + field + '.slug)=' + prefixValue + '.' + field + '.slug'
		}

		return '\tp=' + prefixValue + '.' + field
	}

	/**
	Using the content of the fields, tried to guess the correct representation of each one
	*/
	generateTemplate(fields, cb) {
		fs.readFile(SOURCE_VIEW_PATH, (err, viewTemplate) => {
			if(err) return cb(err);
			let newContent = []

			newContent = Object.keys(fields).map( (field) => {

				if(Array.isArray(fields[field])) { //if it's an array, then we need to add a loop in the template
					let firstRow = fields[field][0]
					let content = 'ul'
					content += OS.EOL + '\teach f in fields.' + field	
					if(firstRow.slug && firstRow.fields) { //it's a reference
						let item = ['\t\t', 'li','\ta(href="/" + f.slug)=f.slug'].join(OS.EOL + "\t\t")
						content += item
					} else {
						content += [OS.EOL + "\t\tli",
									OS.EOL + "\t\t",
									Object.keys(firstRow).map( k => {
										return this.guessRepresentation(firstRow, k, 'f')
									}).join(OS.EOL + "\t\t")].join('')
					}
					return "\t" + content
				}
				return this.guessRepresentation(fields, field)
				
			})

			viewTemplate = viewTemplate.toString().replace("[[FIELDS]]", newContent.join(OS.EOL))
			cb(null, viewTemplate)
		})
	}

	generateRouteFile( cb ) {
		fs.readFile(SOURCE_ROUTE_PATH, (err, content) => {
			if(err) return cb(err)
			let t  = content.toString().replace(/\[\[SLUG\]\]/gi, this.page)
			cb(null, t)
		})
	}
	
	/*
	copy the template files into the right folders, using the right names
	*/
	copyFiles(fieldsToRender) {

		let finalViewName = './views/' + this.page + '.jade'
		let finalRouteName = './routes/' + this.page + '.js'



		this.generateTemplate(fieldsToRender, (err, content) => {
			fs.writeFile(finalViewName, content, (err) => { //save the view template to its destination
				if(err) {
					return this.log("There was a problem saving the view file at '" + finalViewName + "': " + chalk.red(err.toString()))
				}

				this.generateRouteFile( (err, routeContent) => {
					fs.writeFile(finalRouteName, routeContent, (err) => {
						if(err) { 
							return this.log("There was a problem copying the route template: " + chalk.red(err.toString()))
						}
						this.printSuccessMessage();
					})
				})
			})

		})	
	}

	getPageData(cb) {

		let butterClient = new ButterCMS(this.auth_token)
		butterClient.page.retrieve("*", this.page).then( resp => {
			cb(null, resp.data.data);
		}).catch(cb)
	}

	execute(answer) {
		if(!answer.continue){
			return this.log("OK then, see you later!")
		}

		this.getPageData( (err, pageData) => {
			if(err) {
				return this.log("There was a problem getting the data for your page: " + chalk.red(err.data.detail))
			}
			this.copyFiles(pageData.fields)
		})

	}

}