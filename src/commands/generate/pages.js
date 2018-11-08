'use strict'

const {Command, flags} = require('@oclif/command')
const requiredir = require("require-dir")
const PageTypeGenerators = requiredir("../../generators/pages")

class PageTypeCommand extends Command {
	
	async run() {
		const {flags}  = this.parse(PageTypeCommand);

		const targetGeneration = flags.for.toLowerCase().trim();


		//error handling
		if(PageTypeCommand.flags.for.options.indexOf(targetGeneration) == -1) {
			return this.error (`Target not found '${targetGeneration}', please try one of the valid ones - ${PageTypeCommand.flags.for.options.join(",")} - `)
		}

		let page_type = flags.page_type || null
		let atoken = flags.auth_token || null

		const gen = new PageTypeGenerators[targetGeneration](page_type, atoken)

		gen.run();

	}
}

PageTypeCommand.flags = {
	for: flags.string({
		description: 'Target destination for the generator command',
		options: ['express'], //valid options,
	}),
	auth_token: flags.string({ 
		description: "Your AUTH token used to communicate with ButterCMS API",
		required: true
	}),
	page_type: flags.string({
		description: "The page type your blog will be listing"
	})
}

module.exports = PageTypeCommand
		