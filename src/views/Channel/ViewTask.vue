<template>
    <div>
        <div class="px-4 lg:px-16">
            <div class="flex flex-col-reverse lg:flex-row lg:items-baseline">
                <Card class="lg:w-2/4 m-2 p-2 break-words">
                    <vue-markdown :source="task.description"/>
                </Card>
                <div class="flex flex-col lg:w-2/4">
                    <Card class="m-2 p-2 space-y-2">
                        <div class="card-title">{{ task.name }}</div>
                        <div>
                            <div class="flex items-center space-x-2"><BookIcon size="1x"/> <div>{{ channel[channelKey]['channelName'] }}</div></div>
                            <div class="flex items-center space-x-2"><CalendarIcon size="1x"/> <div>{{ task.deadline | dateFormat }}</div></div>
                            <div class="flex items-center space-x-2"><UserIcon size="1x"/> <div>Posted by {{ task.authorName }}</div></div>
                        </div>

                        <div v-if="this.task.attachments.length > 0">
                            <span>Attachments:</span>
                            <div v-for="attachment in this.task.attachments" v-bind:key="attachment.fileName">
                                <a :href="attachment.url" target="_blank">{{ attachment.fileName }}</a>
                            </div>
                        </div>
                    </Card>

                    <DiscussionWidget class="hidden lg:block" :channel="channel" :taskKey="taskKey"/> <!--For PC view-->

                </div>
            </div>

            <DiscussionWidget class="lg:hidden" :channel="channel" :taskKey="taskKey"/> <!--For mobile view-->
        </div>

        <floating-action-button primary @click="gotoEditTask()" v-if="user"><EditIcon/></floating-action-button>
    </div>
</template>

<script>
    import moment from "moment"
    import VueMarkdown from "vue-markdown"
    import Card from "../../components/Card"
    import { CalendarIcon, BookIcon, UserIcon, EditIcon } from 'vue-feather-icons'
    import FloatingActionButton from "../../components/FloatingActionButton"
    import DiscussionWidget from "../../components/Dashboard/Channel/ViewTask/DiscussionWidget";

    export default {
        name: "ViewTask",
        components: {
            DiscussionWidget,
            FloatingActionButton,
            Card,
            VueMarkdown,
            CalendarIcon,
            BookIcon,
            UserIcon,
            EditIcon,
        },
        data() {
            return {
                task: {
                    name: '',
                    deadline: new Date(),
                    description: '',
                    authorName: '',
                    attachments: []
                },
                channel: {},
                channelId: 0,
                taskKey: null,
                firebaseTaskData: null,
                firebaseAuthorData: null,
            }
        },
        computed: {
            channelKey() {
                return Object.keys(this.channel)[0]
            },
            user() {
                return this.$store.state.user
            }
        },
        methods: {
            bindChannel(channelId) {
                const dbQuery = this.$firebase.database().ref('channels').orderByChild('id').equalTo(channelId).limitToFirst(1)

                this.$rtdbBind('channel', dbQuery).catch(e => {
                    console.log(e.message)
                })
            },
            bindTask(channelKey, taskKey) {
                const db = this.$firebase.database()
                const dbRef = db.ref(`tasks/${taskKey}`)
                this.$rtdbBind('firebaseTaskData', dbRef)
            },
            gotoEditTask() {
                this.$router.push(`${this.$route.path}/edit`)
            },
            bindAuthor(authorUid) {
                const db = this.$firebase.database()
                const dbRef = db.ref(`users/${authorUid}`)
                this.$rtdbBind('firebaseAuthorData', dbRef)
            },
            getAttachmentsInfo(fileKeys) {
                const db = this.$firebase.database()
                this.task.attachments = [] //reset
                fileKeys.forEach(key => {
                    const dbRef = db.ref(`attachments/${key}`)
                    dbRef.once('value').then(snap => this.task.attachments.push(snap.val()))
                })
            }
        },
        filters: {
            dateFormat(date) {
                return moment(date).format("MMM Do YYYY")
            }
        },
        mounted() {
            if (!parseInt(this.$route.params.id)) {
                this.$router.push('/')
            } else {
                this.channelId = parseInt(this.$route.params.id)
            }

            // get task key from url if present
            if (this.$route.params.taskKey) {
                this.taskKey = this.$route.params.taskKey
            }

            // get current user
            this.$store.dispatch('getAuthenticatedUser')
        },
        watch: {
            channelId(val) {
                this.bindChannel(val)
            },
            channel() {
                if (this.taskKey) {
                    this.bindTask(this.channelKey, this.taskKey)
                }
            },
            form() {
                console.log(this.form.deadline)
            },
            firebaseTaskData(val) {
                // update form data with firebase
                this.task.name = val.name
                this.task.deadline = new Date(val.deadlineDate)
                this.task.description = val.description

                // bind author data
                if (!this.firebaseAuthorData) this.bindAuthor(val.userId)

                // get attachments
                if (val.attachments) this.getAttachmentsInfo(val.attachments)
            },
            firebaseAuthorData(val) {
                this.task.authorName = val.displayName
            },
        }
    }
</script>

<style scoped>
    .card-title {
        @apply font-bold font-display break-words text-xl;
    }
</style>
