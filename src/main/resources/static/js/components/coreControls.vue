<template>
    <div>
        <label>draw Speed: <input class='form-control ml-2' v-model='drawSpeed'/></label>
        <input type='range' v-model='drawSpeed' class='custom-range mt-2' min='1' max='100'>

        <label>drawing points: <input class='form-control ml-2 mt-2' v-model='countDrawingPoints'/></label>
        <input type='range' v-model='countDrawingPoints' class='custom-range mt-2' min='1' max='5'>

        <label>point size: <input class='form-control ml-2 mt-2' v-model='pointSize'/></label>
        <input type='range' v-model='pointSize' class='custom-range mt-2' min='1' max='30'>

        <button class='btn btn-danger mt-2' @click='resetAllSettings'>reset all points settings</button>
    </div>
</template>

<script>
    import {mapMutations, mapActions} from 'vuex'
    export default {
        name: "coreControls",
        computed: {
            countDrawingPoints: {
                get() {
                    return this.$store.state.countDrawingPoints
                },
                set(newVal) {
                    this.updateCountDrawingPoints(newVal)
                }
            },
            pointSize: {
                get() {
                    return this.$store.state.pointSize
                },
                set(newVal) {
                    this.updatePointSize(newVal)
                }
            },
            drawSpeed: {
                get() {
                    return this.$store.state.drawSpeed
                },
                set(newVal) {
                    this.updateDrawSpeed(newVal)
                }
            }
        },
        methods: {
            ...mapMutations(['updateCountDrawingPoints', 'updateDrawSpeed', 'updatePointSize']),
            ...mapActions(['resetAllSettings'])
        }
    }
</script>

<style scoped>

</style>