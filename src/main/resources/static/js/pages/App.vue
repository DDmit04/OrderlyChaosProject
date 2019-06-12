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
                            <input type="range" v-model='drawSpeed' class="custom-range mt-2" min="1" max="100">

                            <label>drawing points: <input class='form-control ml-2 mt-2' v-model='countDrawingPoints'/></label>
                            <input type="range" v-model='countDrawingPoints' class="custom-range mt-2" min="1" max="5">

                            <label>pixel size: <input class='form-control ml-2 mt-2' v-model='pixelSize'/></label>
                            <input type="range" v-model='pixelSize' class="custom-range mt-2" min="1" max="30">

                            <label>oldPoint red: <input class='form-control ml-2 mt-2' v-model='oldPoint.r'/></label>
                            <input type="range" v-model='oldPoint.r' class="custom-range mt-2" min="0" max="255">
                            <label>oldPoint blue: <input class='form-control ml-2 mt-2' v-model='oldPoint.g'/></label>
                            <input type="range" v-model='oldPoint.g' class="custom-range mt-2" min="0" max="255">
                            <label>oldPoint green: <input class='form-control ml-2 mt-2' v-model='oldPoint.b'/></label>
                            <input type="range" v-model='oldPoint.b' class="custom-range mt-2" min="0" max="255">
                            <canvas id='oldColor' width='50' height='50' style='border:2px solid black'/>

                            <b-form-select v-model='selectedPoint'>
	                            <option v-for='(drawingPoint, index) in drawingPoints' :value='drawingPoints.indexOf(drawingPoint)'>
	                              point: {{index+1}}
	                            </option>
                            </b-form-select>
                            
                            <label>newPointnewRed: <input class='form-control ml-2 mt-2' v-model='newRed'/></label>
                            <input type="range"
                            	@change='changeDrawingPointColor(selectedPoint)'
                            	v-model='newRed' 
                            	class="custom-range mt-2" 
                            	min="0" max="255">
                            
                            <label>newPointnewBlue: <input class='form-control ml-2 mt-2' v-model='newGreen'/></label>
                            <input type="range" 
                            	@change='changeDrawingPointColor(selectedPoint)'
                            	v-model='newGreen' 
                            	class="custom-range mt-2" 
                            	min="0" max="255">
                            
                            <label>newPointnewGreen: <input class='form-control ml-2 mt-2' v-model='newBlue'/></label>
                            <input type="range" 
                            	@change='changeDrawingPointColor(selectedPoint)'
                            	v-model='newBlue' 
                            	class="custom-range mt-2" 
                            	min="0" max="255">
                            
                            <canvas id='newColor' width='50' height='50' style='border:2px solid black'/>

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
        	newRed: 255,
        	newGreen: 0,
        	newBlue: 0,
            points: [],
            corePoints: [],
            oldCountDrawingPoints: 1,
            countDrawingPoints: 1,
            selectedPoint: 0,
            drawingPoints: [
            	{
            		color: { r: 255, g: 0, b: 0 },
            		speed: 1
                },
            ],
            drawSpeed: 1,
            pixelSize: 20,
            drawingFunctions: [],
            startPoint: null,
            drawingFunctionIsRunning: false,
            oldPointColor: null,
            newPointColor: null,
            newX: 0,
            newY: 0,
            ctx: null,
            canvas: null,
            newColorCanv: null,
            newColorCtx: null,
            oldColorCanv: null,
            oldColorCtx: null,
            oldPoint: {
                    r: 0, g: 0, b: 0
            },
        }
    },
    mounted: function() {
        this.oldPointColor = this.convertToRgb(this.oldPoint)
        var canvas = document.getElementById('canv')
        var newColorCanv = document.getElementById('newColor')
        var oldColorCanv = document.getElementById('oldColor')
        if (newColorCanv.getContext) {
            this.newColorCtx = newColorCanv.getContext('2d')
            this.newColorCanv = newColorCanv 
            this.newColorCtx.fillStyle = this.convertToRgb(this.drawingPoints[0].color)
            this.newColorCtx.fillRect(0, 0, this.newColorCanv.width, this.newColorCanv.height)
        } else {
            console.log('canvas error #newColor')
        }
        if (oldColorCanv.getContext) {
            this.oldColorCtx = oldColorCanv.getContext('2d')
            this.oldColorCanv = oldColorCanv 
            this.oldColorCtx.fillStyle = this.oldPointColor
            this.oldColorCtx.fillRect(0, 0, this.oldColorCanv.width, this.oldColorCanv.height)
        } else {
            console.log('canvas error #oldColor')
        }
        if (canvas.getContext) {
            this.ctx = canvas.getContext('2d')
            this.canvas = canvas 
        } else {
            console.log('canvas error #canv')
        }
    },
    watch: { 
    	selectedPoint: function(newVal, oldVal) {
    		this.newColorCtx.fillStyle = this.convertToRgb(this.drawingPoints[newVal].color)
            this.newColorCtx.fillRect(0, 0, this.newColorCanv.width, this.newColorCanv.height)
            this.newRed = this.drawingPoints[newVal].color.r
            this.newGreen = this.drawingPoints[newVal].color.g
            this.newBlue = this.drawingPoints[newVal].color.b
        },
        newRed: function(newVal, oldVal) {
        	this.changeNewPointColor()
        	this.drawingPoints[this.selectedPoint].color.r = newVal
        },
        newGreen: function(newVal, oldVal) {
        	this.changeNewPointColor()
        	this.drawingPoints[this.selectedPoint].color.g = newVal
        },
        newBlue: function(newVal, oldVal) {
        	this.changeNewPointColor()
        	this.drawingPoints[this.selectedPoint].color.b = newVal
        },
        'oldPoint.r': function() {
            this.changeOldPointColor()
            if(this.drawingFunctionIsRunning) { 
                this.restartAllDrawingFunctions()
            }
        },
        'oldPoint.g': function() { 
            this.changeOldPointColor()
            if(this.drawingFunctionIsRunning) {
                this.restartAllDrawingFunctions()
            } 
        },
        'oldPoint.b': function() { 
            this.changeOldPointColor()
            if(this.drawingFunctionIsRunning) {
                this.restartAllDrawingFunctions() 
            }
        },
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
    	changeDrawingPointColor(selectedPoint) {
			if(this.drawingFunctionIsRunning) {
                this.restartAllDrawingFunctions() 
            }
    		this.newColorCtx.fillStyle = this.convertToRgb(this.drawingPoints[this.selectedPoint].color)
    		this.newColorCtx.fillRect(0, 0, this.newColorCanv.width, this.newColorCanv.height)
    	},
    	changeNewPointColor() {
            this.newColorCtx.fillStyle = this.convertToRgb(this.drawingPoints[this.selectedPoint].color)
            this.newColorCtx.fillRect(0, 0, this.newColorCanv.width, this.newColorCanv.height)
    	},
    	changeOldPointColor() {
    		this.oldPointColor = this.convertToRgb(this.oldPoint)
            this.oldColorCtx.fillStyle = this.oldPointColor
            this.oldColorCtx.fillRect(0, 0, this.oldColorCanv.width, this.oldColorCanv.height)
    	},
        convertToRgb(pointColorObject) {
            return 'rgb(' + pointColorObject.r + ',' + pointColorObject.g + ',' + pointColorObject.b + ')'
        },
        recolorOldPoints() {
            for(let i=0; i<this.oldCountDrawingPoints+1; i++) {
                let oldPointIndex = this.points.length - this.countDrawingPoints - i - 1
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
            if(this.points.length-this.drawingPoints.length > 0) {
               this.recolorOldPoints()
            }
            if(this.points.length > 998) {
                this.points.shift()
            }
        },
        startDraw() {
            if(this.corePoints.length > 1) {
                this.newX = this.startPoint.x
                this.newY = this.startPoint.y
            }
            if(this.points.length > 1) {

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

</style>