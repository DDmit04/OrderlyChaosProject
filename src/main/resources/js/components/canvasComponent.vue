<template>
    <div>
        <div id='canvasCol'>
            <resize-observer @notify='changeCanvasSize' />
            <b-alert v-if='showAlert'
                     show dismissible
                     :dismissed='!showAlert'>
                Put two and more points on the canvas and click 'start' on sidebar
                <a href='javascript:void(0)' @click='dontShowAlert'> (dont show again and close)</a>
            </b-alert>
        </div>
        <a download="OrderlyChaos.png"
           :href='image'
           @click='downloadImage'>
            <button class='btn btn-primary my-2' type="button">Download image</button>
        </a>
        <canvas id='canv'
                class='mr-3'
                height='1000'
                style='border: 2px solid black'
                @click='addCorePoint'>
        </canvas>
    </div>
</template>

<script>
    import {mapActions, mapMutations, mapState} from 'vuex'

    export default {
        name: "canvasComponent",
        props: ['movingPoint', 'updateMovingPoint'],
        data() {
            return {
                image: null,
            }
        },
        computed:
            mapState(['showAlert', 'drawingFunctionIsRunning', 'corePoints']),
        mounted: function () {
            let canvas = document.getElementById('canv')
            let canvasWidth = document.getElementById('canvasCol').offsetWidth

            this.initCanvasMutation({
                canvas: canvas,
                canvasWidth: canvasWidth
            })
        },
        methods: {
            ...mapMutations(['initCanvasMutation', 'changeCanvasSizeMutation']),
            ...mapActions(['addCorePointAction']),
            addCorePoint(event) {
                let offsetX = event.offsetX
                let offsetY = event.offsetY
                this.addCorePointAction({ x: offsetX, y: offsetY })
                if (!this.drawingFunctionIsRunning && this.corePoints.length > 1) {
                    this.makeStartPoint()
                }
            },
            makeStartPoint() {
                let firstRandomPoint = Math.floor(Math.random() * (this.corePoints.length))
                let secondRandomPoint = Math.floor(Math.random() * (this.corePoints.length))
                let newX = (this.corePoints[firstRandomPoint].x + this.corePoints[secondRandomPoint].x) / 2
                let newY = (this.corePoints[firstRandomPoint].y + this.corePoints[secondRandomPoint].y) / 2
                this.updateMovingPoint(newX, newY)
            },
            changeCanvasSize () {
                let width = document.getElementById('canvasCol').offsetWidth
                this.changeCanvasSizeMutation(width)
            },
            downloadImage() {
                this.image = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
            },
        }
    }
</script>

<style scoped>

</style>