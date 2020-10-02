const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')
admin.initializeApp(functions.config().firebase)

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
            case '/userid':
                return sendReply(replyToken, [{
                    "type": "text",
                    "text": event.source.userId
                }]).then(() => {
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

function sendMessageToLine(id, message) {
    const channelAccessToken = functions.config().line.bot.channel_access_token
    const pushUrl = "https://api.line.me/v2/bot/message/push"

    const pushBody = {
        to: id,
        messages: [{
            type: 'text',
            text: message
        }]
    }

    return axios.post(pushUrl, pushBody, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${channelAccessToken}`
        }
    })
}

exports.newTaskHandler = functions.database.ref('channels/{channelKey}/tasks/{taskKey}')
    .onCreate( (snapshot, context) => {
        Date.prototype.addHours = function (hours) {
            this.setHours(this.getHours() + hours)
            return this
        }

        const channelKey = context.params.channelKey
        const taskKey = context.params.taskKey
        const task = snapshot.val()
        const deadlineString = new Date(task.deadlineDate).addHours(7).toDateString() // TODO: change this: add 7 hours (GMT+7)

        functions.logger.info({snapshot, context}, {structuredData: true})

        // get channel data
        const channelDataRef =  admin.database().ref(`channels/${channelKey}`)
        channelDataRef.once('value').then(snapshot => {
            const channel = snapshot.val()

            // get users who subscribed
            // TODO: change this to a better approach, maybe flatten the db
            // iterate through all users
            admin.database().ref(`users`).once('value').then(s => {
                // map key-value object to array
                const users = Object.keys(s.val()).map((key) => {
                    return {
                        key: key,
                        ...s.val()[key]
                    }
                })

                users.forEach(user => {
                    const channels = user['subscribedChannels'] || [] // also handle if user has no subscribed channels
                    channels.forEach(ch => {
                        if (ch === channelKey) {
                            // found the user
                            const userId = user.key
                            console.log(userId)

                            // find the integrations
                            admin.database().ref('integrations').child('lineBot').orderByChild('userId').equalTo(userId).once('value').then(e => {
                                if (e.val()) { // check if not null (no integrations)
                                    const lineUsers = Object.keys(e.val())

                                    // send message to all
                                    lineUsers.forEach(id => {
                                        // notify users
                                        const message = `New task "${task.name}" added to channel "${channel.channelName}".\nDeadline is ${deadlineString}.`
                                        sendMessageToLine(id, message).then(() => {
                                            functions.logger.info(`Sent message to LINE: ${id}`)
                                        }).catch(e => {
                                            functions.logger.error(e)
                                        })
                                    })
                                }
                            })
                        }
                    })

                })

            })
        })
    })
