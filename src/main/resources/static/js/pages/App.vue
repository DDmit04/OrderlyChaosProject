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
                <canvas id='canv' width='1000' height='1000' style = 'border:2px solid black' @click='addPoint' />
            </div>
            <div class='col'>
                <div class='card'>
                    <div class='card-body'>
                        <button class='btn btn-success' @keyup.enter='startDraw' @click='startDraw'>start</button>
                        <button class='btn btn-primary' @click='stopDraw'>stop</button>
                        <button class='btn btn-primary' @click='drawOnePoint'>draw one point</button>
                        <button class='btn btn-danger' @click='resetCanvas'>reset</button>
                        <div class='mt-4 form-inline'>
                            <label>draw Speed: <input class='form-control ml-2' v-model='drawSpeed'/></label>
                            <input type='range' v-model='drawSpeed' class='custom-range mt-2' min='1' max='100'>

                            <label>drawing points: <input class='form-control ml-2 mt-2' v-model='countDrawingPoints'/></label>
                            <input type='range' v-model='countDrawingPoints' class='custom-range mt-2' min='1' max='5'>
                            
                            <label>pixel size: <input class='form-control ml-2 mt-2' v-model='pixelSize'/></label>
                            <input type='range' v-model='pixelSize' class='custom-range mt-2' min='1' max='30'>

                            <b-tabs class='mt-3'>
	                            <b-tab title='new point'>
		                            <div class='row mt-3 ml-1'>
			                            <div class='mx-2 smallColorBox' :style='{ background: convertToRgb(drawingPoints[0].color) } '></div>
			                            <div class='mx-2 smallColorBox' :style='{ background: convertToRgb(drawingPoints[1].color) } '></div>
			                            <div class='mx-2 smallColorBox' :style='{ background: convertToRgb(drawingPoints[2].color) } '></div>
			                            <div class='mx-2 smallColorBox' :style='{ background: convertToRgb(drawingPoints[3].color) } '></div>
			                            <div class='mx-2 smallColorBox' :style='{ background: convertToRgb(drawingPoints[4].color) } '></div>
			                            <button class='btn btn-primary ml-2' @click='resetNewPointColors'>reset colors</button>
		                            </div>
		                            <b-form-select class='my-3 w-100' v-model='selectedPoint'>
			                            <option v-for='(drawingPoint, index) in drawingPoints' :value='drawingPoints.indexOf(drawingPoint)'>
			                              point: {{index+1}}
			                            </option>
	                            	</b-form-select>
		                            <label>newPointnewRed: <input class='form-control ml-2 mt-2' v-model='drawingPoints[selectedPoint].color.r'/></label>
		                            <input type='range'
		                            	v-model='drawingPoints[selectedPoint].color.r' 
		                            	class='custom-range mt-2' 
		                            	min='0' max='255'>
		                            
		                            <label>newPointnewBlue: <input class='form-control ml-2 mt-2' v-model='drawingPoints[selectedPoint].color.g'/></label>
		                            <input type='range' 
		                            	v-model='drawingPoints[selectedPoint].color.g' 
		                            	class='custom-range mt-2' 
		                            	min='0' max='255'>
		                            
		                            <label>newPointnewGreen: <input class='form-control ml-2 mt-2' v-model='drawingPoints[selectedPoint].color.b'/></label>
		                            <input type='range' 
		                            	v-model='drawingPoints[selectedPoint].color.b' 
		                            	class='custom-range mt-2'
		                            	min='0' max='255'>
		                            
		                            <div class='mx-2 mt-2 commonColorBox' style='border: 2px solid black;' :style='{ background: convertToRgb(drawingPoints[selectedPoint].color) } '></div>
		                            	
		                        </b-tab>
	                            <b-tab title='old point'>
		                            <label>oldPoint red: <input class='form-control ml-2 mt-2' v-model='oldPoint.r'/></label>
		                            <input type="range" v-model='oldPoint.r' class='custom-range mt-2' min='0' max='255'>
		                            
		                            <label>oldPoint blue: <input class='form-control ml-2 mt-2' v-model='oldPoint.g'/></label>
		                            <input type="range" v-model='oldPoint.g' class='custom-range mt-2' min='0' max='255'>
		                            
		                            <label>oldPoint green: <input class='form-control ml-2 mt-2' v-model='oldPoint.b'/></label>
		                            <input type="range" v-model='oldPoint.b' class='custom-range mt-2' min='0' max='255'>
		                            
		                            <div class='mx-2 mt-2 commonColorBox' style='2px solid black;' :style='{ background: convertToRgb(oldPoint) } '></div>
		                            
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
export default {
    name: 'Canv',
    data() {
        return {
            points: [],
            corePoints: [],
            oldCountDrawingPoints: 0,
            countDrawingPoints: 1,
            selectedPoint: 0,
            drawingPoints: [
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            ],
            drawSpeed: 1,
            pixelSize: 20,
            drawingFunctions: [],
            startPoint: null,
            drawingFunctionIsRunning: false,
            newX: 0,
            newY: 0,
            ctx: null,
            canvas: null,
            oldPoint: {
                    r: 0, g: 0, b: 0
            },
        }
    },
    mounted: function() {
    	this.oldCountDrawingPoints = this.countDrawingPoints
        this.oldPointColor = this.convertToRgb(this.oldPoint)
        var canvas = document.getElementById('canv')
        if (canvas.getContext) {
            this.ctx = canvas.getContext('2d')
            this.canvas = canvas 
        } else {
            console.log('canvas error #canv')
        }
    },
    watch: { 
        pixelSize: function(newVal, oldVal) {
            if(this.drawingFunctionIsRunning) {
                if(newVal > 30) {
                    this.pixelSize = 30
                }
                if(newVal <= 0) {
                    this.pixelSize = 1
                }
                this.restartAllDrawingFunctions()
            }
        },
        countDrawingPoints: function(newVal, oldVal) {
            this.oldCountDrawingPoints = oldVal
            if(newVal > oldVal) {
            	for(let i=0; i<newVal-oldVal; i++) {
            		this.drawingPoints.push({
            			color: {
            				r: 255, g: 0, b: 0
            			}
            		})
            	}
            } else {
            	for(let i=0; i<oldVal-newVal; i++) {
            		this.drawingPoints.pop()
            	}
            }
            if(this.drawingFunctionIsRunning) {
                if(newVal > 5) {
                    this.drawingPoints.lenght = 5
                }
                if(newVal <= 0) {
                    this.drawingPoints.lenght = 1
                }
                this.recolorOldPoints()
                this.restartAllDrawingFunctions()
            }
        },
        drawSpeed: function(newVal, oldVal) {
            if(this.drawingFunctionIsRunning) {
                if(newVal > 100) {
                    this.drawSpeed = 100
                }
                if(newVal <= 0) {
                    this.drawSpeed = 1
                }
                this.drawSpeed = newVal
                this.restartAllDrawingFunctions()
            }
        }
    },
    methods: {
    	resetNewPointColors() {
    		this.drawingPoints = [
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            	{ color: { r: 255, g: 0, b: 0 }, speed: 1 },
            ]
    	},
        convertToRgb(pointColorObject) {
            return 'rgb(' + pointColorObject.r + ',' + pointColorObject.g + ',' + pointColorObject.b + ')'
        },
        recolorOldPoints() {
            for(let i=0; i<this.oldCountDrawingPoints+1; i++) {
                let oldPointIndex = this.points.length - this.countDrawingPoints - i
                if(oldPointIndex > -1) {
                    let oldPoint = this.points[oldPointIndex]
                    let pointSize = this.points[oldPointIndex].pointSize
                    this.ctx.fillStyle = this.oldPointColor
                    this.ctx.fillRect(oldPoint.x, oldPoint.y, pointSize, pointSize)
                    this.points[oldPointIndex].pointColor = this.oldPointColor
                }
            }
        },
        restartAllDrawingFunctions() {
            for(let i=0; i<this.drawingFunctions.length; i++) {
                clearInterval(this.drawingFunctions[i])
            }
            this.drawingFunctions = []
            for(let i=0; i<this.countDrawingPoints; i++) {
                let newDrawingFunction = setInterval( (i) => this.drawOnePointFunction(i), 1000 / this.drawSpeed, i)
                this.drawingFunctions[i] = newDrawingFunction
            }
        },
        drawOnePointFunction(i) { 
        	if(this.points.length-this.countDrawingPoints >= 0) {
        		this.recolorOldPoints()
        	}
            var random = Math.floor(Math.random() * (this.corePoints.length))
            this.newX = (this.corePoints[random].x + this.newX) / 2
            this.newY = (this.corePoints[random].y + this.newY) / 2
            var newPoint = {
                x: this.newX, 
                y: this.newY,
                pointSize: this.pixelSize,
                pointColor: this.convertToRgb(this.drawingPoints[i].color)
            }
            this.startPoint = newPoint 
            this.points.push(newPoint)
            this.ctx.fillStyle = this.convertToRgb(this.drawingPoints[i].color)
            this.ctx.fillRect(this.newX, this.newY, this.pixelSize, this.pixelSize)
            if(this.points.length > 998) {
                this.points.shift()
            }
        },
        startDraw() {
            if(this.corePoints.length > 1) {
                this.newX = this.startPoint.x
                this.newY = this.startPoint.y
            }
            if(this.corePoints.length > 1 && !this.drawingFunctionIsRunning) {
                this.drawingFunctions = []
                for(let i=0; i<this.countDrawingPoints; i++) {
                    let newDrawingFunction = setInterval( (i) => this.drawOnePointFunction(i), 1000 / this.drawSpeed, i)
                    this.drawingFunctions[i] = newDrawingFunction
                }
                this.drawingFunctionIsRunning = true
            }
        },
        drawOnePoint() {
            this.drawOnePointFunction(0)
        },
        stopDraw() {
            for(let i=0; i<this.drawingFunctions.length; i++) {
                clearInterval(this.drawingFunctions[i])
            }
            this.drawingFunctions = []    
            this.drawingFunctionIsRunning = false
        },
        resetCanvas() {
            for(let i=0; i<this.drawingFunctions.length; i++) {
                clearInterval(this.drawingFunctions[i])
            }
            this.drawingFunctionIsRunning = false            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.corePoints = []
            this.points = []
            this.drawingFunctions = []
            this.startPoint = null
        },
        addPoint(event) {
            var offsetX = event.offsetX
            var offsetY = event.offsetY
            if(this.startPoint != null) {
                var newCorePoint = {
                    x: offsetX,
                    y: offsetY
                }
                this.corePoints.push(newCorePoint)
                this.ctx.fillStyle = "orange"
                this.ctx.fillRect(offsetX, offsetY, 15, 15)
            } else {
                this.startPoint = {x:offsetX, y:offsetY}
                this.ctx.fillStyle = "green"
                this.ctx.fillRect(offsetX, offsetY, 15, 15)
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