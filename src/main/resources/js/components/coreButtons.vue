<template>
    <div>
        <button class='btn btn-success mt-sm-2'
                data-toggle="tooltip"
                data-placement="top"
                :disabled='drawingFunctionIsRunning || (corePoints.length < 2)'
                @keyup.enter='startDraw'
                @click='startDraw'>
            <div v-if='corePoints.length < 2'>
                no points
            </div>
            <div v-else-if='drawingFunctionIsRunning'>
                running
            </div>
            <div v-else-if='(allPoints[0].length > 0) && !drawingFunctionIsRunning'>
                continue
            </div>
            <div v-else>
                start
            </div>
        </button>
        <button class='btn btn-primary mt-sm-2'
                :disabled='!drawingFunctionIsRunning'
                @click='stopDraw'>
            stop
        </button>
        <button class='btn btn-primary mt-sm-2'
                :disabled='corePoints.length < 2'
                @click='drawOnePointFunction(0)'>
            draw one
        </button>
        <button class='btn btn-danger mt-sm-2'
                :disabled='corePoints.length == 0 && allPoints[0].length == 0'
                @click='resetCanvas'>
            reset
        </button>
        <button class='btn btn-primary mt-sm-2'
                :disabled='allPoints[0].length == 0'
                @click='cleanOldPoints'>
            clean old points
        </button>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        props:['drawOnePointFunction',
                'startAllDrawingFunctions',
                'stopAllDrawingFunctions'],
        name: "coreButtons",
        computed: {
            ...mapState(['drawingFunctionIsRunning', 'corePoints', 'allPoints'])
        },
        methods: {
            ...mapActions(['resetCanvasAction', 'cleanOldPointsAction']),
            resetCanvas() {
                this.stopAllDrawingFunctions()
                this.resetCanvasAction()
            },
            startDraw() {
                if (this.corePoints.length > 1 && !this.drawingFunctionIsRunning) {
                    this.startAllDrawingFunctions()
                }
            },
            stopDraw() {
              this.stopAllDrawingFunctions()
            },
            cleanOldPoints() {
                this.cleanOldPointsAction()
            }
        }
    }
</script>

<style scoped>

</style>