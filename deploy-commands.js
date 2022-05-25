const { SlashCommandBuilder } = require('@discordjs/builders');

// Interact with Discord's REST API 
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { clientId, guildId, token } = require('./config.json');


// Slash commands of "tictactoe"
const commands = [
    new SlashCommandBuilder().setName('tictactoe').setDescription('Yay! Let us play a game of tic-tac-toe')	
]
    .map(command => command.toJSON());





// rest object to interact with the Discord REST API
const rest = new REST( {version:'9'}).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
    


