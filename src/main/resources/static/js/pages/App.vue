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
            <div class='col'>
                <canvas id='canv' width='1000' height='1000' style='border: 2px solid black' @click='addPoint'></canvas>
            </div>
            <div class='col'>
                <div class='card'>
                    <div class='card-body'>
                        <button class='btn btn-success' @keyup.enter='startDraw' @click='startDraw'>start</button>
                        <button class='btn btn-primary' @click='stopDraw'>stop</button>
                        <button class='btn btn-primary' @click='drawOnePointFunction(0)'>draw one point</button>
                        <button class='btn btn-danger' @click='resetCanvas'>reset</button>

                        <div class='mt-4 form-inline'>

                            <label>draw Speed: <input class='form-control ml-2' v-model='drawSpeed'/></label>
                            <input type='range' v-model='drawSpeed' class='custom-range mt-2' min='1' max='100'>

                            <label>drawing points: <input class='form-control ml-2 mt-2' v-model='countDrawingPoints'/></label>
                            <input type='range' v-model='countDrawingPoints' class='custom-range mt-2' min='1' max='5'>

                            <label>point size: <input class='form-control ml-2 mt-2' v-model='pointSize'/></label>
                            <input type='range' v-model='pointSize' class='custom-range mt-2' min='1' max='30'>

                            <button class='btn btn-danger mt-2' @click='resetAllSettings'>reset all settings</button>

                            <b-tabs class='mt-3'>
                                <b-tab title='new point'>
                                    <div class='row mt-3 ml-1'>
                                        <div v-for='(drawingPoint, index) in drawingPoints.slice(0,countDrawingPoints)'>
                                            <div class='mx-2 smallColorBox'
                                                 :style='{ background: convertToRgb(drawingPoint.color) }'
                                                 :id='"newPoint" + index'
                                                 @click='selectedNewPoint = index'
                                                 @mouseover='addColorBoxStyle("newPoint" + index)'
                                                 @mouseout='removeColorBoxStyle("newPoint" + index)'>
                                            </div>
                                        </div>
                                        <button class='btn btn-primary ml-2' @click='resetNewPointColors'>reset colors
                                        </button>
                                    </div>
                                    <b-form-select class='my-3 w-100' v-model='selectedNewPoint'>
                                        <option v-for='(drawingPoint, index) in drawingPoints.slice(0,countDrawingPoints)'
                                                :value='drawingPoints.indexOf(drawingPoint)'>
                                            new point: {{index+1}}
                                        </option>
                                    </b-form-select>

                                    <label>
                                        <b-form-checkbox class='mt-2' v-model="drawingPoints[selectedNewPoint].customSpeed"></b-form-checkbox>
                                        point speed:
                                        <input :disabled='!drawingPoints[selectedNewPoint].customSpeed' class='form-control ml-2 mt-2' v-model='drawingPoints[selectedNewPoint].speed'/>
                                    </label>
                                    <input :disabled='!drawingPoints[selectedNewPoint].customSpeed'
                                           type='range'
                                           v-model='drawingPoints[selectedNewPoint].speed'
                                           class='custom-range mt-2' min='1' max='100'>

                                    <label>new point red:
                                        <input class='form-control ml-2 mt-2' v-model='drawingPoints[selectedNewPoint].color.r'/>
                                    </label>
                                    <input type='range'
                                           v-model='drawingPoints[selectedNewPoint].color.r'
                                           class='custom-range mt-2'
                                           min='0' max='255'>

                                    <label>new point blue:
                                        <input class='form-control ml-2 mt-2' v-model='drawingPoints[selectedNewPoint].color.g'/>
                                    </label>
                                    <input type='range'
                                           v-model='drawingPoints[selectedNewPoint].color.g'
                                           class='custom-range mt-2'
                                           min='0' max='255'>

                                    <label>new point green:
                                        <input class='form-control ml-2 mt-2' v-model='drawingPoints[selectedNewPoint].color.b'/>
                                    </label>
                                    <input type='range'
                                           v-model='drawingPoints[selectedNewPoint].color.b'
                                           class='custom-range mt-2'
                                           min='0' max='255'>

                                    <div class='mx-2 mt-2 commonColorBox' style='border: 2px solid black;'
                                         :style='{ background: convertToRgb(drawingPoints[selectedNewPoint].color) } '></div>

                                </b-tab>
                                <b-tab title='old point'>
                                    <div class='row mt-3 ml-1'>
                                        <div v-for='(oldPoint, index) in oldPoints.slice(0,countDrawingPoints)'>
                                            <div class='mx-2 smallColorBox'
                                                 :style='{ background: convertToRgb(oldPoint.color) }'
                                                 :id='"oldPoint" + index'
                                                 @click='selectedOldPoint = index'
                                                 @mouseover='addColorBoxStyle("oldPoint" + index)'
                                                 @mouseout='removeColorBoxStyle("oldPoint" + index)'>
                                            </div>
                                        </div>
                                        <button class='btn btn-primary ml-2' @click='resetOldPointColors'>reset colors
                                        </button>
                                    </div>
                                    <b-form-select class='my-3 w-100' v-model='selectedOldPoint'>
                                        <option v-for='(oldPoint, index) in oldPoints.slice(0,countDrawingPoints)'
                                                :value='oldPoints.indexOf(oldPoint)'>
                                            old point: {{index+1}}
                                        </option>
                                    </b-form-select>
                                    <label>old Point red:
                                        <input class='form-control ml-2 mt-2' v-model='oldPoints[selectedOldPoint].color.r'/>
                                    </label>
                                    <input type="range" v-model='oldPoints[selectedOldPoint].color.r' class='custom-range mt-2' min='0' max='255'>

                                    <label>old Point blue:
                                        <input class='form-control ml-2 mt-2' v-model='oldPoints[selectedOldPoint].color.g'/>
                                    </label>
                                    <input type="range" v-model='oldPoints[selectedOldPoint].color.g' class='custom-range mt-2' min='0' max='255'>

                                    <label>old Point green:
                                        <input class='form-control ml-2 mt-2' v-model='oldPoints[selectedOldPoint].color.b'/>
                                    </label>
                                    <input type="range" v-model='oldPoints[selectedOldPoint].color.b' class='custom-range mt-2' min='0' max='255'>

                                    <div class='mx-2 mt-2 commonColorBox' style='border: 2px solid black;' :style='{ background: convertToRgb(oldPoints[selectedOldPoint].color) } '></div>

                                </b-tab>

<!--                                <b-tab title='core point'>-->
<!--                                    <div class='row mt-3 ml-1'>-->
<!--                                        <div v-for='(oldPoint, index) in oldPoints.slice(0,countDrawingPoints)'>-->
<!--                                            <div class='mx-2 smallColorBox'-->
<!--                                                 :style='{ background: convertToRgb(oldPoint.color) }'-->
<!--                                                 :id='"oldPoint" + index'-->
<!--                                                 @click='selectedOldPoint = index'-->
<!--                                                 @mouseover='addColorBoxStyle("oldPoint" + index)'-->
<!--                                                 @mouseout='removeColorBoxStyle("oldPoint" + index)'>-->
<!--                                            </div>-->
<!--                                        </div>-->
<!--                                        <button class='btn btn-primary ml-2' @click='resetOldPointColors'>reset colors-->
<!--                                        </button>-->
<!--                                    </div>-->
<!--                                    <b-form-select class='my-3 w-100' v-model='selectedOldPoint'>-->
<!--                                        <option v-for='(oldPoint, index) in oldPoints.slice(0,countDrawingPoints)'-->
<!--                                                :value='oldPoints.indexOf(oldPoint)'>-->
<!--                                            old point: {{index+1}}-->
<!--                                        </option>-->
<!--                                    </b-form-select>-->
<!--                                    <label>old Point red:-->
<!--                                        <input class='form-control ml-2 mt-2' v-model='oldPoints[selectedOldPoint].color.r'/>-->
<!--                                    </label>-->
<!--                                    <input type="range" v-model='oldPoints[selectedOldPoint].color.r' class='custom-range mt-2' min='0' max='255'>-->

<!--                                    <label>old Point blue:-->
<!--                                        <input class='form-control ml-2 mt-2' v-model='oldPoints[selectedOldPoint].color.g'/>-->
<!--                                    </label>-->
<!--                                    <input type="range" v-model='oldPoints[selectedOldPoint].color.g' class='custom-range mt-2' min='0' max='255'>-->

<!--                                    <label>old Point green:-->
<!--                                        <input class='form-control ml-2 mt-2' v-model='oldPoints[selectedOldPoint].color.b'/>-->
<!--                                    </label>-->
<!--                                    <input type="range" v-model='oldPoints[selectedOldPoint].color.b' class='custom-range mt-2' min='0' max='255'>-->

<!--                                    <div class='mx-2 mt-2 commonColorBox' style='border: 2px solid black;' :style='{ background: convertToRgb(oldPoints[selectedOldPoint].color) } '></div>-->

<!--                                </b-tab>-->
                            </b-tabs>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Canv',
        data() {
            return {
                countDrawingPoints: 1,
                selectedNewPoint: 0,
                selectedOldPoint: 0,
                allPoints: [ [] ],
                corePoints: [],
                drawingPoints: [
                    {color: {r: 255, g: 0, b: 0}, customSpeed: false, speed: 1}
                ],
                oldPoints: [
                    {color: {r: 0, g: 0, b: 0}},
                ],
                drawSpeed: 1,
                pointSize: 20,
                drawingFunctions: [],
                startPoint: null,
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
            drawingPoints: {
                handler: function () {
                    if (this.drawingFunctionIsRunning) {
                        this.restartAllDrawingFunctions()
                    }
                },
                deep: true
            },
            pointSize: function (newVal) {
                if (this.drawingFunctionIsRunning) {
                    if (newVal > 30) {
                        this.pointSize = 30
                    }
                    if (newVal <= 0) {
                        this.pointSize = 1
                    }
                    this.restartAllDrawingFunctions()
                }
            },
            countDrawingPoints: function (newVal, oldVal) {
                if (newVal > oldVal && this.drawingPoints.length < newVal && this.oldPoints.length < newVal) {
                    for (let i = 0; i < newVal - oldVal; i++) {
                        this.drawingPoints.push({
                            color: { r: 255, g: 0, b: 0 },
                            customSpeed: false,
                            speed: 1
                        })
                        this.allPoints.push( [] )
                        this.oldPoints.push( {color: {r: 0, g: 0, b: 0} } )
                    }
                }
                if (this.drawingFunctionIsRunning) {
                    if (newVal > 5) {
                        this.drawingPoints.lenght = 5
                    }
                    if (newVal <= 0) {
                        this.drawingPoints.lenght = 1
                    }
                    for(let i = 0; i < oldVal; i++) {
                        this.recolorOldPoint(i)
                    }
                    this.restartAllDrawingFunctions()
                }
            },
            drawSpeed: function (newVal) {
                if (this.drawingFunctionIsRunning) {
                    if (newVal > 100) {
                        this.drawSpeed = 100
                    }
                    if (newVal <= 0) {
                        this.drawSpeed = 1
                    }
                    this.drawSpeed = newVal
                    this.restartAllDrawingFunctions()
                }
            }
        },
        methods: {
            addColorBoxStyle(id) {
                let colorBox = document.getElementById(id)
                colorBox.style.outline = '2px solid rgb(0,150,255)'
            },
            removeColorBoxStyle(id) {
                let colorBox = document.getElementById(id)
                colorBox.style.outline = ''
            },
            stopAllDrawingFunctions() {
                for (let i = 0; i < this.drawingFunctions.length; i++) {
                    clearInterval(this.drawingFunctions[i])
                }
                this.drawingFunctions = []
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
                    this.drawingFunctions[i] = newDrawingFunction
                }
            },
            restartAllDrawingFunctions() {
                this.stopAllDrawingFunctions()
                this.drawingFunctions = []
                this.startAllDrawingFunctions()
            },
            resetNewPointColors() {
                for(let i = 0; i < this.drawingPoints.length; i++) {
                    this.drawingPoints[i] = {
                        color: {r: 255, g: 0, b: 0},
                        customSpeed: false,
                        speed: 1
                    }
                }
            },
            resetOldPointColors() {
                for(let i = 0; i < this.oldPoints.length; i++) {
                    this.oldPoints[i] = { color: {r: 0, g: 0, b: 0} }
                }
            },
            resetAllSettings() {
                this.resetOldPointColors()
                this.resetNewPointColors()
                this.drawSpeed = 1
                this.pointSize = 20
                this.countDrawingPoints = 1
            },
            convertToRgb(pointColorObject) {
                return 'rgb(' + pointColorObject.r + ',' + pointColorObject.g + ',' + pointColorObject.b + ')'
            },
            recolorOldPoint(i) {
                let oldPointIndex = this.allPoints[i].length - 1
                if (oldPointIndex > -1) {
                    let oldPoint = this.allPoints[i][oldPointIndex]
                    let oldPointSize = oldPoint.pointSize
                    let oldPointColor = this.convertToRgb(this.oldPoints[i].color)
                    this.canvasCtx.fillStyle = oldPointColor
                    this.canvasCtx.fillRect(oldPoint.x, oldPoint.y, oldPointSize, oldPointSize)
                    this.allPoints[i][oldPointIndex].pointColor = this.convertToRgb(oldPointColor)
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
                    pointColor: this.convertToRgb(this.drawingPoints[i].color)
                };
                this.startPoint = newPoint
                this.allPoints[i].push(newPoint)
                this.canvasCtx.fillStyle = this.convertToRgb(this.drawingPoints[i].color)
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
                this.stopAllDrawingFunctions()
                this.drawingFunctionIsRunning = false
                this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.corePoints = []
                this.allPoints = [ [] ]
                this.drawingFunctions = []
                this.startPoint = null
            },
            addPoint(event) {
                let offsetX = event.offsetX;
                let offsetY = event.offsetY;
                if (this.startPoint != null) {
                    let newCorePoint = {
                        x: offsetX,
                        y: offsetY
                    };
                    this.corePoints.push(newCorePoint)
                    this.canvasCtx.fillStyle = "orange"
                    this.canvasCtx.fillRect(offsetX, offsetY, 15, 15)
                } else {
                    this.startPoint = {x: offsetX, y: offsetY}
                    this.canvasCtx.fillStyle = "green"
                    this.canvasCtx.fillRect(offsetX, offsetY, 15, 15)
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