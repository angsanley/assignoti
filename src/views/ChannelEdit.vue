<template>
    <div class="text-center space-y-2">
        <h3 v-if="channel">{{ channel[channelKey].channelName }}</h3>
    </div>
</template>

<script>
    export default {
        name: "ChannelEdit",
        data() {
            return {
                channel: null,
                channelId: 0,
            }
        },
        computed: {
            channelKey() {
                return Object.keys(this.channel)[0]
            }
        },
        mounted() {
            if (!parseInt(this.$route.params.id)) {
                this.$router.push('/')
            } else {
                this.channelId = parseInt(this.$route.params.id)
            }
        },
        methods: {
          bindChannel(channelId) {
              const dbQuery = this.$firebase.database().ref('channels').orderByChild('id').equalTo(channelId).limitToFirst(1)

              this.$rtdbBind('channel', dbQuery).catch(e => {
                  console.log(e.message)
              })
          }
        },
        watch: {
            channelId(val) {
                this.bindChannel(val)
            },
        }
    }
</script>

<style scoped>

</style>
