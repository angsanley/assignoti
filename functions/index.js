const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const utils = require('./utils/utils')
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

        switch (event.message.text) {
            case '/getid':
                return sendReply(replyToken, [{
                    "type": "text",
                    "text": JSON.stringify(event.source)
                }]).then(() => {
                    functions.logger.info('Sent reply to LINE')
                    res.send('OK')
                }).catch(e => {
                    functions.logger.error(e)
                    res.send('Not OK')
                })
            default:
                return sendReply(replyToken, [{
                    "type": "text",
                    "text": "ngomong opo toh?"
                }]).then(() => {
                    functions.logger.info('Sent reply to LINE')
                    res.send('OK')
                }).catch(e => {
                    functions.logger.error(e)
                    res.send('Not OK')
                })
        }

    }

    const handleGroupIncomingMessage = event => {
        const replyToken = event.replyToken
        functions.logger.info(event)

        switch (event.message.text) {
            case '/getid':
                return sendReply(replyToken, [{
                    "type": "text",
                    "text": JSON.stringify(event.source)
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

async function sendMessageToDiscordWebhook (url, message, files) {
    let formData = new FormData();
    formData.append("content", message)

    if (files) {
        // get first 10 items only
        if (files.length > 10) files = files.slice(0,10)

        // download file from URL
        const downloadPromises = []
        files.forEach(file => {
            downloadPromises.push(new Promise(async (resolve, reject) => {
                axios({
                    url: file.url,
                    method: 'GET',
                    responseType: 'stream'
                }).then(res => {
                    const stream = res.data.pipe(fs.createWriteStream(`/tmp/${file.fileName}`))
                    // wait until file finished downloading
                    stream.on('finish', () => {
                        formData.append(file.fileName, fs.createReadStream(`/tmp/${file.fileName}`))
                        resolve()
                    })
                }).catch(e => {
                    reject(e)
                })
            }))
        })

        await Promise.all(downloadPromises)
    }

    const config = {
        method: 'post',
        url,
        headers: {
            ...formData.getHeaders()
        },
        data: formData,
    }

    return axios(config)
}

exports.newTaskHandler = functions.database.ref('tasks/{taskKey}')
    .onCreate( (snapshot, context) => {
        Date.prototype.addHours = function (hours) {
            this.setHours(this.getHours() + hours)
            return this
        }

        const taskKey = context.params.taskKey
        const task = snapshot.val()
        const channelKey = task.channelKey
        const attachmentKeys = task.attachments
        const deadlineString = new Date(task.deadlineDate).addHours(7).toDateString() // TODO: change this: add 7 hours (GMT+7)

        functions.logger.info({snapshot, context}, {structuredData: true})

        // get attachments data
        let attachmentPromises = []
        let attachments = []
        attachmentKeys.forEach(key => {
            attachmentPromises.push(admin.database().ref(`attachments/${key}`).once('value').then(snap => snap.val()))
        })
        Promise.all(attachmentPromises).then(res => attachments = res)

        // get channel data
        const channelDataRef = admin.database().ref(`channels/${channelKey}`)
        channelDataRef.once('value').then(snapshot => {
            const channel = snapshot.val()

            // get users who subscribed
            admin.database().ref(`subscriptions`).orderByChild('channelKey').equalTo(channelKey).once('value').then(snapshot => {
                const subscriptions = utils.objectToArray(snapshot.val())

                subscriptions.forEach(({userId}) => {
                    // search line id from integrations
                    admin.database().ref('integrations/lineBot').orderByChild('userId').equalTo(userId).once('value').then(snapshot => {
                        if (snapshot.numChildren() > 0) {
                            const lineUserIds = Object.keys(snapshot.val())
                            lineUserIds.forEach(id => {
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

                    // search discord webhooks from integrations
                    admin.database().ref('integrations/discordWebhook').orderByChild('userId').equalTo(userId).once('value').then(snapshot => {
                        if (snapshot.numChildren() > 0) {
                            const webhooks = utils.objectToArray(snapshot.val())
                            webhooks.forEach(({url}) => {
                                // notify users
                                const message = `New task "${task.name}" added to channel "${channel.channelName}".\nDeadline is ${deadlineString}.`
                                sendMessageToDiscordWebhook(url, message, attachments).then(() => {
                                    functions.logger.info(`Sent message to Discord: ${url}`)
                                }).catch(e => {
                                    functions.logger.error(e)
                                })
                            })
                        }
                    })

                })
            })
        })
    })
