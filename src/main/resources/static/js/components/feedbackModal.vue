<template>
    <div>
        <li class="nav-item">
            <a v-b-modal.modal-1 class="nav-link active" href="#">feedback</a>
        </li>

        <b-modal id="modal-1"
                 title="send feedback"
                 @cancel='restartModal'>
            <div v-if='feedbackSent'>
                Thanks for yor feedback!
            </div>
            <div v-else-if='feedbackError'>
                Something went wrong with sending feedback please try again later!
            </div>
            <div v-else>
                <form>
                    <div class="form-group">
                        <label for="exampleFormControlInput1">your email address</label>
                        <input class="form-control"
                               v-model='feedbackEmail'
                               id="exampleFormControlInput1"
                               type="email"
                               placeholder="name@example.com">
                    </div>
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">your feedback</label>
                        <textarea class="form-control"
                                  id="exampleFormControlTextarea1"
                                  v-model='feedbackText'
                                  rows="3"/>
                    </div>
                </form>
            </div>
            <template slot="modal-footer" slot-scope="{ ok, cancel, hide }">
                <div v-if='!feedbackSent'>
                    <b-button size="sm" variant="success" @click="sendFeedback" :disabled='loading'>
                        <b-spinner v-if='loading'></b-spinner>
                        <div v-else>send</div>
                    </b-button>
                </div>
                <b-button size="sm" variant="danger" @click="cancel()">
                    Cancel
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
    import api from 'api/feedback'

    export default {
        name: "feedbackModal",
        data() {
            return {
                loading: false,
                feedbackError: false,
                feedbackSent: false,
                feedbackText: '',
                feedbackEmail: '',
            }
        },
        methods: {
            async sendFeedback() {
                let feedbackMessage = {
                    id: null,
                    email: this.feedbackEmail,
                    feedbackText: this.feedbackText
                }
                this.loading = true
                const result = await api.add(feedbackMessage)
                if(result.ok) {
                    this.feedbackSent = true
                } else {
                    this.feedbackSent = false
                    this.feedbackError = true
                }
                this.loading = false
                this.feedbackEmail = ''
                this.feedbackText = ''
            },
            restartModal() {
                this.loading = false
                this.feedbackSent = false
                this.feedbackError = false
            }
        }
    }
</script>

<style scoped>

</style>