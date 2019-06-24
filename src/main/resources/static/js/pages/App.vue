<template>
    <div class='container-fluid'>
        <nav class='navbar navbar-expand-lg navbar-primary navbar-default bg-light scrolling-navbar'>
            <div class='navbar-nav mr-auto'>
                <li class='nav-item'>
                    <a class="navbar-brand">Orderly Chaos</a>
                </li>
            </div>
            <ul class="nav justify-content-end">
                <feedbackModal/>
            </ul>
        </nav>

        <div class='row mt-4 ml-1'>
            <div class='col'>
                <canvas id='canv'
                        width='920'
                        height='950'
                        style='border: 2px solid black'
                        @click='addCorePoint'>
                </canvas>
                <a download="OrderlyChaos.png"
                   :href='image'
                   @click='downloadImage'>
                    <button class='btn btn-primary my-2' type="button">Download image</button>
                </a>
            </div>
            <div class='col-lg col-sm'>
                <div class='card mb-2'>
                    <div class='card-body'>

                        <coreButtons :drawOnePointFunction='drawOnePointFunction'
                                     :startAllDrawingFunctions='startAllDrawingFunctions'
                                     :stopAllDrawingFunctions='stopAllDrawingFunctions'/>

                        <div class='mt-4 form-inline'>
                            <div class='col-sm'>
                                <coreControls />
                            </div>
                            <b-tabs class='mt-3 col-sm'>
                                <b-tab title='new point'>
                                    <pointSelector :pointArrayType='"new"'/>
                                    <pointColors :pointArrayType='"new"'
                                                 :restartAllDrawingFunctions='restartAllDrawingFunctions'/>
                                </b-tab>
                                <b-tab title='old point'>
                                    <pointSelector :pointArrayType='"old"'/>
                                    <pointColors :pointArrayType='"old"'
                                                 :restartAllDrawingFunctions='restartAllDrawingFunctions'/>
                                </b-tab>
                                <b-tab title='core point' :disabled='corePoints.length === 0'>
                                        <pointSelector :pointArrayType='"core"'/>
                                        <pointColors :pointArrayType="'core'"
                                                     :restartAllDrawingFunctions='restartAllDrawingFunctions'/>
                                </b-tab>
                            </b-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapState, mapActions} from 'vuex'
    import pointColors from 'components/pointColors.vue'
    import pointSelector from 'components/pointSelector.vue'
    import coreControls from 'components/coreControls.vue'
    import coreButtons from 'components/coreButtons.vue'
    import feedbackModal from 'components/feedbackModal.vue'

    export default {
        name: 'Canv',
        components: {
            pointColors,
            pointSelector,
            coreControls,
            coreButtons,
            feedbackModal
        },
        data() {
            return {
                image: null,
                movingPoint: {
                    x: null,
                    y: null
                },
                drawingFunctions: []
            }
        },
        computed:
            mapState(['drawingPoints', 'corePoints',
                    'countDrawingPoints', 'pointSize', 'canvas',
                    'drawSpeed', 'allPoints', 'allPointsLimit',
                    'oldCountDrawingPoints', 'drawingFunctionIsRunning']),
        mounted: function () {
            this.initCanvasMutation(document.getElementById('canv'))
        },
        watch: {
            drawingPoints: function() {
                if(this.drawingFunctionIsRunning) {
                    this.restartAllDrawingFunctions()
                }
            },
            drawSpeed: function () {
                if(this.drawingFunctionIsRunning) {
                    this.restartAllDrawingFunctions()
                }
            },
            countDrawingPoints: function () {
                if(this.drawingFunctionIsRunning) {
                    for (let i = 0; i < this.oldCountDrawingPoints; i++) {
                        this.recolorOldPoint(i)
                    }
                    this.restartAllDrawingFunctions()
                }
            },
            pointSize: function () {
                if(this.drawingFunctionIsRunning) {
                    this.restartAllDrawingFunctions()
                }
            }
        },
        methods: {
            ...mapActions(['addCorePointAction']),
            ...mapMutations(['initCanvasMutation', 'addNewPointMutation',
                'startDrawingFunctionMutation', 'stopDrawingFunctionsMutation',
                'recolorOldPointMutation',
                'updateMovingPointMutation', 'cleanAllPointsArrayMutation']),
            downloadImage() {
                this.image = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
            },
            addCorePoint(event) {
                let offsetX = event.offsetX
                let offsetY = event.offsetY
                this.addCorePointAction({ x: offsetX, y: offsetY })
                if (!this.drawingFunctionIsRunning && this.corePoints.length > 1) {
                    this.makeStartPoint()
                }
            },
            makeStartPoint() {
                let randomFirstPoint = Math.floor(Math.random() * (this.corePoints.length))
                let randomSecondPoint = Math.floor(Math.random() * (this.corePoints.length))
                this.movingPoint.x = (this.corePoints[randomFirstPoint].x + this.corePoints[randomSecondPoint].x) / 2
                this.movingPoint.y = (this.corePoints[randomFirstPoint].y + this.corePoints[randomSecondPoint].y) / 2
            },
            startAllDrawingFunctions() {
                for (let i = 0; i < this.countDrawingPoints; i++) {
                    let drawSpeed
                    if(this.drawingPoints[i].customSpeed) {
                        drawSpeed = this.drawingPoints[i].speed
                    } else {
                        drawSpeed = this.drawSpeed
                    }
                    let newDrawingFunction = setInterval((i) => this.drawOnePointFunction(i), 1000 / drawSpeed, i)
                    this.drawingFunctions.push(newDrawingFunction)
                }
                this.startDrawingFunctionMutation()
            },
            stopAllDrawingFunctions() {
                for (let i = 0; i < this.drawingFunctions.length; i++) {
                    clearInterval(this.drawingFunctions[i])
                }
                this.drawingFunctions = []
                this.stopDrawingFunctionsMutation()
            },
            restartAllDrawingFunctions() {
                this.stopAllDrawingFunctions()
                this.startAllDrawingFunctions()
            },
            drawOnePointFunction(drawingPointNumber) {
                if (this.allPoints[drawingPointNumber].length - 1 >= 0) {
                    this.recolorOldPoint(drawingPointNumber)
                }
                let random = Math.floor(Math.random() * (this.corePoints.length))
                let newX = (this.corePoints[random].x + this.movingPoint.x) / 2
                let newY = (this.corePoints[random].y + this.movingPoint.y) / 2
                this.movingPoint.x = newX
                this.movingPoint.y = newY
                let newPoint = {
                    x: newX,
                    y: newY,
                    size: this.pointSize,
                    color: this.drawingPoints[drawingPointNumber].color
                }
                this.addNewPointMutation({
                    index: drawingPointNumber,
                    point: newPoint
                })
                if(this.allPoints[drawingPointNumber].length > this.allPointsLimit) {
                    this.cleanAllPointsArrayMutation(drawingPointNumber)
                }
            },
            recolorOldPoint(drawingPointNumber) {
                let oldPointIndex = this.allPoints[drawingPointNumber].length - 1
                if (oldPointIndex > -1) {
                    let oldPoint = this.allPoints[drawingPointNumber][oldPointIndex]
                    this.recolorOldPointMutation({
                        oldPoint: oldPoint,
                        drawingPointNumber: drawingPointNumber,
                        oldPointIndex: oldPointIndex
                    })
                }
            },
        }
    }
</script>
<style>
</style>