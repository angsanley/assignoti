const functions = require('firebase-functions')
const axios = require('axios')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.lineWebhookHandler = functions.https.onRequest((req, res) => {
    const channelAccessToken = functions.config().line.bot.channel_access_token
    const eventType = req.body.events ? req.body.events[0].type : ''

    const sendReply = (replyToken, messages) => {
        const replyUrl = "https://api.line.me/v2/bot/message/reply"
        const replyBody = {
            replyToken,
            messages
        }
        return axios.post(replyUrl, replyBody, {
            headers: {Authorization: `Bearer ${channelAccessToken}`}
        })
    }

    const handleIncomingMessage = event => {
        const replyToken = event.replyToken
        functions.logger.info(event)

        const messages = [{
            "type": "text",
            "text": event.message.text
        }]

        return sendReply(replyToken, messages).then(() => {
            functions.logger.info('Sent reply to LINE')
            res.send('OK')
        }).catch(e => {
            functions.logger.error(e)
            res.send('Not OK')
        })

    }

    const handleGroupIncomingMessage = event => {
        const replyToken = event.replyToken
        functions.logger.info(event)

        switch (event.message.text) {
            case 'amt jelek':
                const messages = [{
                    "type": "image",
                    originalContentUrl: 'https://i.postimg.cc/YqqpgVct/download.jpg',
                    previewImageUrl: 'https://i.postimg.cc/YqqpgVct/download.jpg',
                }, {
                    "type": "text",
                    "text": 'Saya setuju'
                }]

                return sendReply(replyToken, messages).then(() => {
                    functions.logger.info('Sent reply to LINE')
                    res.send('OK')
                }).catch(e => {
                    functions.logger.error(e)
                    res.send('Not OK')
                })
            default:
                res.send('Unknown message')
                break
        }
    }

    switch (eventType) {
        case 'message':
            const event = req.body.events[0]
            if (event.source.type === 'user') return handleIncomingMessage(event)
            else return handleGroupIncomingMessage(event)
        default:
            res.send('OK')
            return false
    }
});
