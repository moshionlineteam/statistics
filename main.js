// by rain c:
require('dotenv').config()

const {
    EmbedBuilder,
    WebhookClient
} = require('discord.js');

const moment = require('moment');
var momentDurationFormatSetup = require("moment-duration-format");

momentDurationFormatSetup(moment);

const axios = require('axios');
const webhookClient = new WebhookClient({
    url: process.env.WEBHOOK_URL
});
const cron = require('node-cron');
const i = firstRun();


cron.schedule('* * * * *', async () => {
    c(i);
});


async function firstRun() {
    let i = await webhookClient.send({
        username: process.env.WEBBOOK_NAME,
        avatarURL: process.env.WEBBOOK_AVATAR,
        content: 'MO Statistics first run please wait a moment...'
    })
    return i;
}

async function request(url) {
    let data = '';
    try {
        await axios.get(url)
            .then(async function (response) {

                if (response.status != 200) {
                    data = false;
                } else {
                    data = response.data;
                }
            });
    } catch (e) {
        data = false;
    }
    return data
}

async function getMO() {

    const embed = new EmbedBuilder();

    let data = await request(process.env.API_URL);

    embed.setTimestamp();
    embed.setColor("#8d4ca6");

    if (data) {

        embed.setTitle('Moshi Online Statistics')
        embed.addFields([{
                name: `Players`,
                value: ` `,
                inline: false
            },
            {
                name: `Total users :bar_chart:`,
                value: data.total_users.toString(),
                inline: true
            },
            {
                name: `Staff users :medal:`,
                value: data.staff_users.toString(),
                inline: true
            },
            {
                name: `Banned users :no_entry_sign:`,
                value: data.banned_users.toString(),
                inline: true
            },
            {
                name: `Users today :chart_with_upwards_trend:`,
                value: data.daily_users.toString(),
                inline: true
            },
            {
                name: `Users yesterday :chart_with_upwards_trend:`,
                value: data.yesterday_users.toString(),
                inline: true
            },
            {
                name: `Users this week :chart_with_upwards_trend:`,
                value: data.weekly_users.toString(),
                inline: true
            },
            {
                name: `Users this month :chart_with_upwards_trend:`,
                value: data.monthly_users.toString(),
                inline: true
            },
            {
                name: `Game interactions`,
                value: ` `,
                inline: false
            },
            {
                name: `Games played :video_game:`,
                value: data.total_games.toLocaleString(),
                inline: true
            },
            {
                name: `Missions played :detective:`,
                value: data.total_missions.toLocaleString(),
                inline: true
            },
            {
                name: `Puzzles played :jigsaw:`,
                value: data.total_puzzles.toLocaleString(),
                inline: true
            },
            {
                name: `Codes redeemed :boom:`,
                value: data.total_codes_redeemed.toLocaleString(),
                inline: true
            },
            {
                name: `What players own`,
                value: ` `,
                inline: false
            },
            {
                name: `Items owned :house:`,
                value: data.total_items_owned.toLocaleString(),
                inline: true
            },
            {
                name: `Clothing owned :shirt:`,
                value: data.total_clothing_owned.toLocaleString(),
                inline: true
            },
            {
                name: `Seeds owned :potted_plant:`,
                value: data.total_seeds_owned.toLocaleString(),
                inline: true
            },
            {
                name: `Moshlings owned :rabbit:`,
                value: data.total_moshlings_owned.toLocaleString(),
                inline: true
            },
            {
                name: `\u200b`,
                value: `\u200b`,
                inline: true
            },
            {
                name: `\u200b`,
                value: `\u200b`,
                inline: true
            },
            {
                name: `Social interactions`,
                value: ` `,
                inline: false
            },
            {
                name: `Messages :speech_balloon:`,
                value: data.total_messages.toLocaleString(),
                inline: true
            },
            {
                name: `Video gifts :gift_heart:`,
                value: data.total_gifts.toLocaleString(),
                inline: true
            },
            {
                name: `Mystery gifts :gift:`,
                value: data.total_mysterygifts.toLocaleString(),
                inline: true
            }
        ]);
    } else {
        embed.setTitle('Moshi Online Statistics Error')
        embed.setDescription('Error getting statistics from the API :(')
    }

    return embed;
}

async function c(i) {

    let e = await i;
    let mo = await getMO();

    webhookClient.editMessage(e.id, {
        username: process.env.WEBBOOK_NAME,
        content: '',
        avatarURL: process.env.WEBBOOK_AVATAR,
        embeds: [mo]

    });
}
