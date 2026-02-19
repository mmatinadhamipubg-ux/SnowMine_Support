const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    Routes,
    REST,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const commands = [
    new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Send the SnowMine ticket panel')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
    );
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {

    // ================= PANEL =================
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'panel') {

            const embed = new EmbedBuilder()
                .setTitle("SnowMine Support")
                .setDescription(
`Please follow the rules ‼️

If you did not find the answer to your question in the rules section, you may open a ticket.

Do not mention the owner.

Insulting or abusive behavior will result in serious punishment.`
                )
                .setColor("#5865F2");

            const row1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('help')
                        .setLabel('Help')
                        .setEmoji('❓')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('buy')
                        .setLabel('BuyClient')
                        .setEmoji('🛒')
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId('projects')
                        .setLabel('Projects')
                        .setEmoji('📂')
                        .setStyle(ButtonStyle.Secondary)
                );

            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('staff')
                        .setLabel('Staff Apply')
                        .setEmoji('📝')
                        .setStyle(ButtonStyle.Danger)
                );

            return interaction.reply({
                embeds: [embed],
                components: [row1, row2]
            });
        }
    }

    // ================= CREATE TICKET =================
    if (interaction.isButton() && interaction.customId !== "close") {

        const channelName = `ticket-${interaction.user.username}`;

        const existing = interaction.guild.channels.cache.find(
            c => c.name === channelName
        );

        if (existing) {
            return interaction.reply({
                content: "You already have an open ticket.",
                ephemeral: true
            });
        }

        const channel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                },

                // ===== STAFF ROLES =====
                {
                    id: "1327594566244892742",
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                },
                {
                    id: "1327610392079368275",
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                },
                {
                    id: "1327629818334023751",
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                },
                {
                    id: "1327624883647283241",
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                },
                {
                    id: "1327609456959291503",
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                }
            ]
        });

        const closeRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close')
                    .setLabel('Close Ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger)
            );

        await channel.send({
            content:
`Ticket opened by ${interaction.user}

Please be patient and wait for the server staff to respond.
Thank you for your patience 🙏`,
            components: [closeRow]
        });

        return interaction.reply({
            content: "Your ticket has been created.",
            ephemeral: true
        });
    }

    // ================= CLOSE TICKET =================
    if (interaction.isButton() && interaction.customId === "close") {

        await interaction.reply({
            content: `Ticket closed by ${interaction.user}`
        });

        setTimeout(() => {
            interaction.channel.delete();
        }, 3000);
    }
});

client.login(TOKEN);
