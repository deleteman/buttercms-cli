'use strict'

const {Command, flags} = require('@oclif/command')
const requiredir = require("require-dir")
const BlogGenerators = requiredir("../../generators/blog")

class BlogCommand extends Command {
	
	async run() {
		const {flags} = this.parse(BlogCommand)

		const targetGeneration = flags.for.toLowerCase().trim();

		//error handling
		if(BlogCommand.flags.for.options.indexOf(targetGeneration) == -1) {
			return this.error (`Target not found '${targetGeneration}', please try one of the valid ones - ${BlogCommand.flags.for.options.join(",")} - `)
		}

		const gen = new BlogGenerators[targetGeneration]()

		gen.run();

	}
}

BlogCommand.flags = {
	for: flags.string({
		description: 'Target destination for the generator command',
		options: ['express'] //valid options
	})
}

module.exports = BlogCommand
	