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
                <canvas id='canv' width='1000' height='1000' style='border: 2px solid black' @click='addCorePoint1'></canvas>
            </div>
            <div class='col-4'>
                <div class='card mb-2'>
                    <div class='card-body'>
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
                        <button class='btn btn-primary' :disabled='!drawingFunctionIsRunning' @click='stopAllDrawingFunctions'>stop</button>
                        <button class='btn btn-primary' :disabled='corePoints.length < 2' @click='drawOnePointFunction(0)'>draw one</button>
                        <button class='btn btn-danger' :disabled='corePoints.length == 0' @click='resetCanvas1'>reset</button>
                        <button class='btn btn-primary mt-2' :disabled='allPoints[0].length == 0' @click='cleanOldPoints'>clean old points</button>

                        <div class='mt-4 form-inline'>

                            <coreControls />

                            <b-tabs class='mt-3'>
                                <b-tab title='new point'>
                                    <pointSelector :point='"new"'
                                                   :objectToRgbFunction='objectToRgbFunction'/>
                                    <pointColors :point='"new"'
                                                     :objectToRgbFunction='objectToRgbFunction'/>
                                </b-tab>
                                <b-tab title='old point'>
                                    <pointSelector :point='"old"'
                                                   :objectToRgbFunction='objectToRgbFunction'/>
                                    <pointColors :point='"old"'
                                                     :objectToRgbFunction='objectToRgbFunction'/>
                                </b-tab>
                                <b-tab title='core point'>
                                    <div v-if='corePoints.length > 0'>
                                        <pointSelector :point='"core"'
                                                       :objectToRgbFunction='objectToRgbFunction'/>
                                        <pointColors :point="'core'"
                                                         :objectToRgbFunction='objectToRgbFunction'/>
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
    import {mapGetters, mapMutations, mapActions, mapState} from 'vuex'
    import pointColors from 'components/pointColors.vue'
    import pointSelector from 'components/pointSelector.vue'
    import coreControls from 'components/coreControls.vue'

    export default {
        name: 'Canv',
        components: {
            pointColors,
            pointSelector,
            coreControls
        },
        watch: {
            getCountDrawingPoints: function() {
                if(this.drawingFunctionIsRunning) {
                    for (let i = 0; i < this.oldCountDrawingPoints; i++) {
                        this.recolorOldPoint(i)
                    }
                    this.restartAllDrawingFunctions()
                }
            }
        },
        computed:
            mapGetters(['drawingPoints', 'corePoints',
                              'oldPoints', 'selectedNewPoint',
                              'selectedOldPoint','selectedCorePoint',
                              'getCountDrawingPoints', 'getPointSize',
                              'getDrawSpeed', 'allPoints', 'corePointSize',
                                'oldCountDrawingPoints', 'drawingFunctionIsRunning',
                                'canvasCtx', 'canvas', 'drawingFunctions', 'startPoint']),
        data() {
            return {
                newX: 0,
                newY: 0,
            }
        },
        mounted: function () {
            this.initCanvas(document.getElementById('canv'))
        },
        watch: {
            getDrawSpeed: function () {
                this.restartAllDrawingFunctions()
            },
            getCountDrawingPoints: function () {
                this.restartAllDrawingFunctions()
            },
            getPointSize: function () {
                this.restartAllDrawingFunctions()
            }
        },
        methods: {
            ...mapActions(['addCorePointAction']),
            ...mapMutations(['initCanvas', 'addCorePoint', 'runDrawingFunction',
                                'stopDrawingFunctions', 'updateStartPoint', 'pushNewPoint',
                                'cleanOldPoints', 'recolorOldPointMutation', 'drawPoint', 'resetCanvas']),
            stopAllDrawingFunctions() {
                for (let i = 0; i < this.drawingFunctions.length; i++) {
                    clearInterval(this.drawingFunctions[i])
                }
                this.stopDrawingFunctions()
            },
            startAllDrawingFunctions() {
                for (let i = 0; i < this.getCountDrawingPoints; i++) {
                    let drawSpeed
                    if(this.drawingPoints[i].customSpeed) {
                        drawSpeed = this.drawingPoints[i].speed
                    } else {
                        drawSpeed = this.getDrawSpeed
                    }
                    let newDrawingFunction = setInterval((i) => this.drawOnePointFunction(i), 1000 / drawSpeed, i)
                    this.runDrawingFunction(newDrawingFunction)
                }
            },
            restartAllDrawingFunctions() {
                this.stopAllDrawingFunctions()
                this.startAllDrawingFunctions()
            },
            objectToRgbFunction(pointColorObject) {
                return 'rgb(' + pointColorObject.r + ',' + pointColorObject.g + ',' + pointColorObject.b + ')'
            },
            cleanOldPoints() {
                this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.cleanOldPoints()
                for(let i = 0; i < this.corePoints.length; i++) {
                    let x = this.corePoints[i].x
                    let y = this.corePoints[i].y
                    let color = this.objectToRgbFunction(this.corePoints[i].color)
                    this.drawPoint({x: x, y: y, color: color, pointSize: this.pointSize})
                }
            },
            recolorOldPoint(i) {
                let oldPointIndex = this.allPoints[i].length - 1
                if (oldPointIndex > -1) {
                    let oldPoint = this.allPoints[i][oldPointIndex]
                    let x = oldPoint.x
                    let y = oldPoint.y
                    let oldPointSize = oldPoint.pointSize
                    let oldPointColor = this.objectToRgbFunction(this.oldPoints[i].color)
                    this.canvasCtx.fillStyle = oldPointColor
                    this.drawPoint({x: x, y: y, color: oldPointColor, pointSize: oldPointSize})
                }
            },
            drawOnePointFunction(i) {
                if (this.allPoints[i].length - 1 >= 0) {
                    this.recolorOldPoint(i)
                }
                let random = Math.floor(Math.random() * (this.corePoints.length));
                this.newX = (this.corePoints[random].x + this.newX) / 2
                this.newY = (this.corePoints[random].y + this.newY) / 2
                let newPoint = {
                    x: this.newX,
                    y: this.newY,
                    pointSize: this.getPointSize,
                    pointColor: this.objectToRgbFunction(this.drawingPoints[i].color)
                };
                this.pushNewPoint({index: i, point: newPoint})
                this.drawPoint({x: this.newX, y: this.newY, color: newPoint.pointColor, pointSize: newPoint.pointSize})
                // if (this.allPoints[i].length > 998) {
                //     this.allPoints[i].shift()
                // }
            },
            startDraw() {
                if (this.corePoints.length > 1) {
                    this.newX = this.startPoint.x
                    this.newY = this.startPoint.y
                }
                if (this.corePoints.length > 1 && !this.drawingFunctionIsRunning) {
                    this.startAllDrawingFunctions()
                }
            },
            resetCanvas1() {
                this.stopAllDrawingFunctions()
                this.resetCanvas()
                // this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                // this.corePoints = []
                // this.allPoints = [ [] ]
                // this.drawingFunctions = []
                // this.startPoint = {x: null, y: null}
            },
            addCorePoint1(event) {
                this.addCorePointAction( {x: event.offsetX, y: event.offsetY} )
            }
        }
    }
</script>
<style>
    .commonColorBox {
        width: 50px;
        height: 50px;
    }

    .smallColorBox {
        width: 20px;
        height: 20px;
    }
</style>