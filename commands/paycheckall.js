const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    // Setting up the slash command for paycheckall
    application_command: () => 
        new SlashCommandBuilder()
            .setName('paycheckall')
            .setDescription('Distributes paychecks to all countries.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only admins can trigger this.
    
    async interaction(interaction, game) {
        // Make sure the game is in full swing; can't just hand out money if the game isn't rolling. 
        if (!game.started) {
            return await interaction.reply({
                content: 'The game hasn’t started yet, fam!',
                ephemeral: true
            });
        }

        // List to track which countries got their cash flow. 
        const addedMoney = []; 

        // Iterate through each country and add their paycheck. 
        game.countries.forEach(country => {
            const moneyToAdd = Math.floor(country.industry / 20); // Getting the bread based on their industry, no decimals.
            country.money += moneyToAdd; // Add the money to the country's account.
            addedMoney.push(`${country.country}: $${moneyToAdd}`); // Logging what each country got.
        });

        // Crafting a response to let everyone know who got paid.
        const responseMessage = addedMoney.length > 0 
            ? `Paycheck alert! Here’s the distribution:\n${addedMoney.join(', ')}` 
            : 'No countries to distribute cash to, what a bummer.';

        // Sending the details back to the admin.
        await interaction.reply({
            content: responseMessage,
            ephemeral: true // Keep it chill, visible only to the admin.
        });
    }
};
