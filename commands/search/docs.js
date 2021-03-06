const Command = require('../../structures/Command');
const request = require('node-superfetch');
const branches = ['stable', 'master', 'rpc', 'commando'];

module.exports = class DocsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'docs',
			aliases: ['discord-js-docs', 'djs-docs', 'djs', 'discord-js'],
			group: 'search',
			memberName: 'docs',
			description: 'Searches the Discord.js docs for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'discord.js',
					url: 'https://discord.js.org/#/'
				},
				{
					name: 'TeeSeal/discord.js-docs-api',
					url: 'https://github.com/TeeSeal/discord.js-docs-api'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What would you like to search the docs for?',
					type: 'string',
					parse: query => query.toLowerCase()
				}
			]
		});
	}

	async run(msg, { query }) {
		let project = 'main';
		let branch = query.split(' ');
		if (branches.includes(branch[0])) {
			query = branch.slice(1).join(' ');
			branch = branch[0];
		} else {
			branch = 'master';
		}
		if (branch === 'commando' || branch === 'rpc') {
			project = branch;
			branch = 'master';
		}
		try {
			const { body } = await request
				.get(`https://djsdocs.sorta.moe/${project}/${branch}/embed`)
				.query({ q: query });
			if (!body) return msg.say('Could not find any results.');
			return msg.embed(body);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
