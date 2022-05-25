// Require the necessary discord.js classes
const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const { token } = require('./config.json');
const { TicTacToe } = require('./databaseObjects.js')


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Bot replies with "pong" when message "ping" is sent
client.on('messageCreate', (msg) => {
	
	if (msg.content === 'ping') {
		msg.channel.send("pong");
	} else if (msg.content === "Perry") {
		msg.channel.send("the Platypus");
	} else if (msg.content === "Ashwin" || msg.content === "ashwin") {
		msg.channel.send("Iyer");
	} else if (msg.content === "Devanshi" || msg.content === "Dthanki" || msg.content === "amitgarg9")
		msg.channel.send("Dthanki is a clown ha!");
});


/* Tic Tac Toe */
let tictactoe_state
let EMPTY = Symbol("empty");  //constant symbol for EMPTY
let PLAYER = Symbol("player");
let BOT = Symbol("bot");


// Creates and updates the TicTacToe Grid as per the specified Symbol
function makeGrid() {
	components = []

	for (let row = 0; row < 3; row++){
		actionRow = new MessageActionRow()

		for (let col = 0; col < 3; col++) {
			messageButton = new MessageButton()
				.setCustomId('tictactoe_' + row + '_' + col)

			switch(tictactoe_state[row][col]) {
				case EMPTY:
					messageButton
						.setLabel(' ')
						.setStyle('SECONDARY')
					break;
				case PLAYER:
					messageButton
						.setLabel('X')
						.setStyle('PRIMARY')
					break;
				case BOT:
					messageButton
						.setLabel('O')
						.setStyle('DANGER')
					break;

			}
				
			actionRow.addComponents(messageButton)

		}
		components.push(actionRow)

	}
	return components

}

// Chooses a random Integer for the bot for row and col after PLAYER's move
function getrandomInteger(max) {
	return Math.floor(Math.random() * max)
}



function isDraw(){
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (tictactoe_state[i][j] = EMPTY){
				return false
			}
		}
	}
	return true; 
}

function isGameOver(){
	for (let i = 0; i < 3; i++) {
		if ((tictactoe_state[i][0] == tictactoe_state[i][1] )&&  (tictactoe_state[i][1] == tictactoe_state[i][2]) && (tictactoe_state[i][2] != EMPTY)) {
			return true	
		}  
		
		if ((tictactoe_state[0][i] == tictactoe_state[1][i]) &&  (tictactoe_state[1][i] == tictactoe_state[2][i]) && (tictactoe_state[2][i] != EMPTY)) {
			return true	
		}  	
	}

	if (tictactoe_state[1][1]!= EMPTY) {
		if ((tictactoe_state[0][0] == tictactoe_state[1][1]) &&  (tictactoe_state[1][1] == tictactoe_state[2][2])) {
			return true
		} else if ((tictactoe_state[2][0] == tictactoe_state[1][1]) &&  (tictactoe_state[1][1] == tictactoe_state[0][2])) {
			return true
		}
	}
	return false; 
	
}


// Interact with TicTacToe Buttons
client.on('interactionCreate', async interaction => {
	
	if (!interaction.isButton()) return;

	if (!interaction.customId.startsWith('tictactoe_')) return;

	if (isGameOver()) {
		interaction.update({ 
			content: "You won the game of tic-tac-toe!",
			components: makeGrid()
		})
		return;
	} 

	let interactionlocation = interaction.customId.split("_")
	let row = interactionlocation[1]
	let col = interactionlocation[2]


	if (tictactoe_state[row][col] != EMPTY) {
        interaction.update({
            content: "You can't select that position!",
            components: makeGrid()
        })
        return;
    }

	tictactoe_state[row][col] = PLAYER;
	

	if (isGameOver()) {

		let user = await TicTacToe.findOne( {
			where: {
				user_id: interaction.user.id
			}
		});

		if (!user) {
			user = await TicTacToe.create({user_id: interaction.user_id})
		}

		await user.increment('score');






		interaction.update({ 
			content: "You won the game of tic-tac-toe! You have now won " + (user.get('score') + 1) +" time(s).",
			components: []
		})
		return;
	} 

	if (isDraw()) {
		interaction.update({ 
			content: "The game resulted in a DRAW!",
			components: []
		})
		return;
	}

	


	/* Bot Interaction Functionality */
	let bot_row
	let bot_col

	do {
        bot_row = getrandomInteger(3);
        bot_col = getrandomInteger(3);
    } while(tictactoe_state[bot_row][bot_col] != EMPTY);

	tictactoe_state[bot_row][bot_col] = BOT

	if (isGameOver()) {
		interaction.update({ 
			content: "You lost the game of tic-tac-toe!",
			components: makeGrid()
		})
		return;
	} 

	if (isDraw()) {
		interaction.update({ 
			content: "The game resulted in a DRAW!",
			components: []
		})
		return;
	}
 
	interaction.update({ 
		components: makeGrid()
	})

	
});






// Interacts with Slash Commands
client.on('interactionCreate', async interaction => {
	
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'tictactoe') {
		tictactoe_state = [
			[EMPTY, EMPTY, EMPTY],
			[EMPTY, EMPTY, EMPTY],
			[EMPTY, EMPTY, EMPTY],
		]
		await interaction.reply({content: 'Playing a game of tic-tac-toe!', components: makeGrid() });
	} 
});



client.login(token);


