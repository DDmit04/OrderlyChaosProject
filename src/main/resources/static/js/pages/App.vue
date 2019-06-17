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
                        <button class='btn btn-primary' :disabled='!drawingFunctionIsRunning' @click='stopDraw'>stop</button>
                        <button class='btn btn-primary' :disabled='corePoints.length < 2' @click='drawOnePointFunction(0)'>draw one</button>
                        <button class='btn btn-danger' :disabled='corePoints.length == 0' @click='resetCanvas'>reset</button>
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
    import {mapGetters} from 'vuex'
    import pointColors from 'static/js/components/pointColors.vue'
    import pointSelector from 'static/js/components/pointSelector.vue'
    import coreControls from 'components/coreControls.vue'

    export default {
        name: 'Canv',
        components: {
            pointColors,
            pointSelector,
            coreControls
        },
        computed: mapGetters(['drawingPoints', 'corePoints',
                              'oldPoints', 'selectedNewPoint',
                              'selectedOldPoint','selectedCorePoint',
                              'getCountDrawingPoints', 'getPointSize',
                              'getDrawSpeed', 'allPoints', 'corePointSize']),
        data() {
            return {
                drawingFunctions: [],
                startPoint: {
                    x: null,
                    y: null,
                },
                drawingFunctionIsRunning: false,
                newX: 0,
                newY: 0,
                canvasCtx: null,
                canvas: null
            }
        },
        mounted: function () {
            const canvas = document.getElementById('canv')
            if (canvas.getContext) {
                this.canvasCtx = canvas.getContext('2d')
                this.canvas = canvas
            } else {
                console.log('canvas error #canv')
            }
        },
        watch: {
            corePoints: {
                handler: function () {
                    if(this.corePoints.length > 0) {
                        let x = this.corePoints[this.selectedCorePoint].x
                        let y = this.corePoints[this.selectedCorePoint].y
                        let color = this.corePoints[this.selectedCorePoint].color
                        this.canvasCtx.fillStyle = this.objectToRgbFunction(color)
                        this.canvasCtx.fillRect(x, y, this.corePointSize, this.corePointSize)
                    }
                },
                deep: true
            },
        },
        methods: {
            stopAllDrawingFunctions() {
                for (let i = 0; i < this.drawingFunctions.length; i++) {
                    clearInterval(this.drawingFunctions[i])
                }
                this.drawingFunctions = []
            },
            startAllDrawingFunctions() {
                for (let i = 0; i < this.getCountDrawingPoints; i++) {
                    let drawSpeed
                    if(this.drawingPoints[i].customSpeed) {
                        drawSpeed = this.drawingPoints[i].speed
                    } else {
                        drawSpeed = this.drawSpeed
                    }
                    let newDrawingFunction = setInterval((i) => this.drawOnePointFunction(i), 1000 / drawSpeed, i)
                    this.drawingFunctions[i] = newDrawingFunction
                }
            },
            restartAllDrawingFunctions() {
                this.stopAllDrawingFunctions()
                this.drawingFunctions = []
                this.startAllDrawingFunctions()
            },
            objectToRgbFunction(pointColorObject) {
                return 'rgb(' + pointColorObject.r + ',' + pointColorObject.g + ',' + pointColorObject.b + ')'
            },
            cleanOldPoints() {
                this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.allPoints = [ [] ]
                for(let i = 0; i < this.corePoints.length; i++) {
                    let x = this.corePoints[i].x
                    let y = this.corePoints[i].y
                    let color = this.objectToRgbFunction(this.corePoints[i].color)
                    this.canvasCtx.fillStyle = color
                    this.canvasCtx.fillRect(x, y, this.corePointSize, this.corePointSize)
                }
            },
            recolorOldPoint(i) {
                let oldPointIndex = this.allPoints[i].length - 1
                if (oldPointIndex > -1) {
                    let oldPoint = this.allPoints[i][oldPointIndex]
                    let oldPointSize = oldPoint.pointSize
                    let oldPointColor = this.objectToRgbFunction(this.oldPoints[i].color)
                    this.canvasCtx.fillStyle = oldPointColor
                    this.canvasCtx.fillRect(oldPoint.x, oldPoint.y, oldPointSize, oldPointSize)
                    this.allPoints[i][oldPointIndex].pointColor = this.objectToRgbFunction(oldPointColor)
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
                    pointSize: this.pointSize,
                    pointColor: this.objectToRgbFunction(this.drawingPoints[i].color)
                };
                this.startPoint = newPoint
                this.allPoints[i].push(newPoint)
                this.canvasCtx.fillStyle = this.objectToRgbFunction(this.drawingPoints[i].color)
                this.canvasCtx.fillRect(this.newX, this.newY, this.pointSize, this.pointSize)
                if (this.allPoints[i].length > 998) {
                    this.allPoints[i].shift()
                }
            },
            startDraw() {
                if (this.corePoints.length > 1) {
                    this.newX = this.startPoint.x
                    this.newY = this.startPoint.y
                }
                if (this.corePoints.length > 1 && !this.drawingFunctionIsRunning) {
                    this.startAllDrawingFunctions()
                    this.drawingFunctionIsRunning = true
                }
            },
            stopDraw() {
                this.stopAllDrawingFunctions()
                this.drawingFunctionIsRunning = false
            },
            resetCanvas() {
                this.stopDraw()
                this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.corePoints = []
                this.allPoints = [ [] ]
                this.drawingFunctions = []
                this.startPoint = {x: null, y: null}
            },
            checkNewCorePointOverlap(x, y) {
                let overlap = false
                for(let i = 0; i < this.corePoints.length; i++) {
                    if(this.corePoints[i].x == x && this.corePoints[i].y == y) {
                        overlap = true
                    }
                }
                return overlap
            },
            addCorePoint(event) {
                let offsetX = event.offsetX
                let offsetY = event.offsetY
                if (this.startPoint.x == null && this.startPoint.y == null) {
                    this.startPoint.x = offsetX
                    this.startPoint.y = offsetY
                }
                if(!this.checkNewCorePointOverlap(offsetX, offsetY)) {
                    let newCorePoint = {
                        x: offsetX,
                        y: offsetY,
                        color: {r: 0, g: 0, b: 255},
                        size: this.corePointSize,
                    }
                    this.corePoints.push(newCorePoint)
                    this.canvasCtx.fillStyle = this.objectToRgbFunction(newCorePoint.color)
                    this.canvasCtx.fillRect(offsetX, offsetY, newCorePoint.size, newCorePoint.size)
                }
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