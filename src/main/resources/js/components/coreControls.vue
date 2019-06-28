<template>
    <div>
        <label class='justify-content-start' for='drawSpeed'>
            draw speed:
            <input class='form-control ml-2' v-model='drawSpeed'/>
        </label>
        <input class='custom-range mt-2'
               v-model='drawSpeed'
               id='drawSpeed'
               type='range'
               min='1' max='100'>

        <label class='justify-content-start' for='countDrawingPoints'>
            points count:
            <input class='form-control ml-2 mt-2' v-model='countDrawingPoints'/>
        </label>
        <input class='custom-range mt-2'
               v-model='countDrawingPoints'
               id='countDrawingPoints'
               type='range'
               min='1' :max='drawingPointsLimit'>
        <label class='justify-content-start' for='pointSize'>
            point size:
            <input class='form-control ml-2 mt-2' v-model='pointSize'/>
        </label>
        <input class='custom-range mt-2'
               v-model='pointSize'
               id='pointSize'
               type='range'
               min='1' max='30'>

        <button class='btn btn-danger mt-2' @click='resetAllSettingsAction'>
            reset all points settings
        </button>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    export default {
        name: "coreControls",
        computed: {
            ...mapState(['drawingPointsLimit']),
            countDrawingPoints: {
                get() { return this.$store.state.countDrawingPoints },
                set(newVal) { this.updateCountDrawingPointsAction(newVal) }
            },
            pointSize: {
                get() { return this.$store.state.pointSize },
                set(newVal) { this.updatePointSizeAction(newVal) }
            },
            drawSpeed: {
                get() { return this.$store.state.drawSpeed },
                set(newVal) { this.updateDrawSpeedAction(newVal) }
            }
        },
        methods: {
            ...mapActions(['resetAllSettingsAction', 'updateCountDrawingPointsAction',
                            'updateDrawSpeedAction', 'updatePointSizeAction'])
        }
    }
</script>

<style scoped>

</style>