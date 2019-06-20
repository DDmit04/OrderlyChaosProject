<template>
    <div>
        <button class='btn btn-success'
                data-toggle="tooltip" data-placement="top" title="make two point on canvas to start drawing"
                :disabled='drawingFunctionIsRunning || corePoints.length < 2'
                @keyup.enter='startDraw'
                @click='startDraw'>
            <div v-if='corePoints.length < 2'>no points</div>
            <div v-else-if='drawingFunctionIsRunning'>running</div>
            <div v-else-if='allPoints[0].length > 0 && !drawingFunctionIsRunning'>continue</div>
            <div v-else>start</div>
        </button>
        <button class='btn btn-primary'
                :disabled='!drawingFunctionIsRunning' @click='stopDrawingFunctionsMutation'>
            stop
        </button>
        <button class='btn btn-primary'
                :disabled='corePoints.length < 2' @click='drawOnePointFunction(0)'>
            draw one
        </button>
        <button class='btn btn-danger'
                :disabled='corePoints.length == 0 && allPoints[0].length == 0' @click='resetCanvas'>
            reset
        </button>
        <button class='btn btn-primary mt-2'
                :disabled='allPoints[0].length == 0' @click='cleanOldPointsAction'>
            clean old points
        </button>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from 'vuex'
    export default {
        props:['drawOnePointFunction', 'startAllDrawingFunctions'],
        name: "coreButtons",
        computed: {
            ...mapState(['drawingFunctionIsRunning', 'corePoints', 'allPoints'])
        },
        methods: {
            ...mapMutations(['stopDrawingFunctionsMutation']),
            ...mapActions(['resetCanvasAction', 'cleanOldPointsAction']),
            resetCanvas() {
                this.stopDrawingFunctionsMutation()
                this.resetCanvasAction()
            },
            startDraw() {
                if (this.corePoints.length > 1 && !this.drawingFunctionIsRunning) {
                    this.startAllDrawingFunctions()
                }
            },
        }
    }
</script>

<style scoped>

</style>