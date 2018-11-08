'use strict'

const {Command} = require('@oclif/command')


module.exports = class BaseGenerator extends Command{

	prompts() {
		throw new Error("::Base Generator - prompts:: Needs to be implemented")
	}	

	execute() {
		throw new Error("::Base Generator - execute:: Needs to be implemented")	
	}

	async run() {
		this
			.prompts() //ask the questions
			.then(this.execute.bind(this)) //execute the command
	}
}