<template>
    <Card class="m-2 p-2 space-y-2 hidden lg:block">
        <div class="card-title">Discussions</div>
        <div class="flex flex-row w-full my-1"
             v-for="({ timestamp, author, content }, i) in discussions"
             :key="`#post-${timestamp}-${i}`"
        >
            <img
                    class="w-8 h-8 rounded-full flex-shrink-0"
                    :src="participatingUsers[author].photoURL"
            />
            <div class="ml-2 self-center leading-tight">
                                <span class="font-display font-bold">
                                    {{ participatingUsers[author].displayName }}
                                </span>
                {{content}}
                <span class="font-light text-xs">
                                    {{ timestamp | relativeDateFormat }}
                                </span>
            </div>
        </div>
        <Input
                v-model="discussionContent"
                name="task-name"
                id="task-name"
                type="text"
                placeholder="Got anything in your mind?"
                :textarea="true"
        />
        <Button @click="makePost()" class="pt-4 w-full" primary>
            <span class="text-center w-full">Post</span>
        </Button>
    </Card>
</template>

<script>
    import moment from "moment";
    import Card from "@/components/Card"
    import Input from "@/components/Input"
    import Button from "@/components/Button"

    export default {
        name: "DiscussionWidget",
        props: ['channel', 'taskKey'],
        components: {Card, Input, Button},
        data() {
            return {
                participatingUsers: {}, // users participating in discussion
                firebaseDiscussionData: null,
                discussions: [],
                discussionContent: '',
                channelKey: '',
            }
        },
        methods: {
            makePost() {
                const db = this.$firebase.database()
                const dbRef = db.ref(`tasks/${this.taskKey}/discussions`)

                const dataToPush = {
                    author: this.$firebase.auth().currentUser.uid,
                    timestamp: (new Date()).toISOString(),
                    content: this.discussionContent
                };

                dbRef.push(dataToPush)
                    .then(() => {
                        this.discussionContent = ''
                    })
                    .catch(e => {
                        alert('ngeri')
                        console.log(e.message)
                    })
            },

            bindDiscussion(channelKey, taskKey) {
                const db = this.$firebase.database()
                const dbRef = db.ref(`tasks/${taskKey}/discussions`)
                this.$rtdbBind('firebaseDiscussionData', dbRef)
            },
        },
        filters: {
            relativeDateFormat(date) {
                return moment(date).fromNow()
            }
        },
        computed: {
            channelKey() {
                return Object.keys(this.channel)[0]
            },
        },
        watch: {
            firebaseDiscussionData(val) {
                this.discussions = Object.values(val)
                Object.values(val).forEach(({ author }) => {
                    // check if user data has been fetched
                    !this.participatingUsers[author] && this.$firebase.database().ref(`users/${author}`).once('value')
                        .then(snapshot => {
                            this.$set(this.participatingUsers, author, snapshot.val())
                        })
                })
            },
        },
        mounted() {
            this.bindDiscussion(this.channelKey, this.taskKey)
        }
    }
</script>

<style scoped>

</style>
