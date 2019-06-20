<template>
    <div class='container-fluid'>
        <nav class='navbar navbar-expand-lg navbar-primary navbar-default bg-light scrolling-navbar'>
            <div class='navbar-nav mr-auto'>
                <li class='nav-item'>
                    <a class="navbar-brand">N</a>
                </li>
            </div>
        </nav>
        <div class='row mt-4 ml-1'>
            <div class='col-8'>
                <canvas id='canv' width='1000' height='1000' style='border: 2px solid black' @click='addCorePoint'></canvas>
            </div>
            <div class='col-4'>
                <div class='card mb-2'>
                    <div class='card-body'>
                        <coreButtons :drawOnePointFunction='drawOnePointFunction'
                                     :startAllDrawingFunctions='startAllDrawingFunctions'/>

                        <div class='mt-4 form-inline'>

                            <coreControls />

                            <b-tabs class='mt-3'>
                                <b-tab title='new point'>
                                    <pointSelector :pointArrayType='"new"'/>
                                    <pointColors :pointArrayType='"new"'/>
                                </b-tab>
                                <b-tab title='old point'>
                                    <pointSelector :pointArrayType='"old"'/>
                                    <pointColors :pointArrayType='"old"'/>
                                </b-tab>
                                <b-tab title='core point'>
                                    <div v-if='corePoints.length > 0'>
                                        <pointSelector :pointArrayType='"core"'/>
                                        <pointColors :pointArrayType="'core'"/>
                                    </div>
                                    <div class='mx-auto mt-2' v-else>
                                        no core points yet
                                    </div>

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
    import {mapMutations, mapActions, mapState} from 'vuex'
    import pointColors from 'components/pointColors.vue'
    import pointSelector from 'components/pointSelector.vue'
    import coreControls from 'components/coreControls.vue'
    import coreButtons from 'components/coreButtons.vue'

    export default {
        name: 'Canv',
        components: {
            pointColors,
            pointSelector,
            coreControls,
            coreButtons
        },
        data() {
            return {
                movingPoint: {
                    x: null,
                    y: null
                }
            }
        },
        computed:
            mapState(['drawingPoints', 'corePoints',
                'countDrawingPoints', 'pointSize',
                'drawSpeed', 'allPoints',
                'oldCountDrawingPoints', 'drawingFunctionIsRunning']),
        mounted: function () {
            this.initCanvasMutation(document.getElementById('canv'))
        },
        watch: {
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
                'runDrawingFunctionMutation', 'stopDrawingFunctionsMutation',
                'cleanOldPointsMutation', 'recolorOldPointMutation',
                'updateMovingPointMutation', 'cleanAllPointsArrayMutation']),

            addCorePoint(event) {
                let x = event.offsetX
                let y = event.offsetY
                this.addCorePointAction({
                    x: x,
                    y: y
                })
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
                    pointArrayType: newPoint
                })
                if(this.allPoints[drawingPointNumber].length > 100) {
                    this.cleanAllPointsArrayMutation(drawingPointNumber)
                }
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
                    this.runDrawingFunctionMutation(newDrawingFunction)
                }
            },
            recolorOldPoint(drawingPointNumber) {
                let oldPointIndex = this.allPoints[drawingPointNumber].length - 1
                if (oldPointIndex > -1) {
                    let oldPoint = this.allPoints[drawingPointNumber][oldPointIndex]
                    this.recolorOldPointMutation({
                        oldPoint,
                        drawingPointNumber: drawingPointNumber,
                        oldPointIndex: oldPointIndex
                    })
                }
            },
            restartAllDrawingFunctions() {
                this.stopDrawingFunctionsMutation()
                this.startAllDrawingFunctions()
            },
        }
    }
</script>
<style>
</style>