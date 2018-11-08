'use strict'

const {Command, flags} = require('@oclif/command')
const requiredir = require("require-dir")
const PageGenerators = requiredir("../../generators/page")

class PageCommand extends Command {
	
	async run() {
		const {flags}  = this.parse(PageCommand);

		const targetGeneration = flags.for.toLowerCase().trim();


		//error handling
		if(PageCommand.flags.for.options.indexOf(targetGeneration) == -1) {
			return this.error (`Target not found '${targetGeneration}', please try one of the valid ones - ${PageCommand.flags.for.options.join(",")} - `)
		}

		let page = flags.page || null
		let atoken = flags.auth_token || null

		const gen = new PageGenerators[targetGeneration](page, atoken)

		gen.run();

	}
}

PageCommand.flags = {
	for: flags.string({
		description: 'Target destination for the generator command',
		options: ['express'], //valid options,
	}),
	page: flags.string({
		description: "Indicates the slug assigned to the new page",
		required: true
	}),
	auth_token: flags.string({ 
		description: "Your AUTH token used to communicate with ButterCMS API",
		required: true
	})
}

module.exports = PageCommand
		