<template>
    <div>
        <canvas id='canv' width='1000' height='1000' style = 'border:2px solid black' @click='addPoint' />
        <input v-model='drawSpeed' placeholder='ponts per sec'/>
        <input v-model='drawingPoints' placeholder='ponts per sec'/>
        <button @keyup.enter='startDraw' @click='startDraw'>start</button>
        <button @click='stopDraw'>stop</button>
        <button @click='drawOnePoint'>draw one point</button>
        <button @click='resetCanvas'>reset</button>
        <div class='col-4'>
            <label>drawSpeed</label>
            <input type="range" v-model='drawSpeed' class="custom-range" min="0" max="100">
        </div>
        <div class='col-4'>
            <label>drawing points</label>
            <input type="range" v-model='drawingPoints' class="custom-range" min="0" max="5">
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
            drawingPoints: 1,
            drawSpeed: 10,
            drawingFunctions: [],
            drawOnePointFunction: null,
            startPoint: null,
            drawingFunctionRunning: false,
            newX: 0,
            newY: 0,
            ctx: null,
            canvas: null
        }
    },
    mounted: function() {
        var canvas = document.getElementById('canv')
        if (canvas.getContext) {
            this.ctx = canvas.getContext('2d')
            this.canvas = canvas 
        } else {
            console.log('canvas error')
        }
    },
    watch: { 
        drawingPoints: function(newVal, oldVal) {
            if(newVal > 0 && newVal < 5 && this.drawOnePointFunction != null) {
                for(let i=0; i<this.drawingFunctions.length; i++) {
                    clearInterval(this.drawingFunctions[i])
                }
                this.drawingFunctions = []
                this.drawingPoints = newVal
                for(let i=0; i<this.drawingPoints; i++) {
                    let newDrawingFunction = setInterval( (i) => this.drawOnePointFunction(i), 1000 / this.drawSpeed, i)
                    this.drawingFunctions[i] = newDrawingFunction
                }
                if(oldVal > newVal) {
                    for(var i=0; i<oldVal-newVal+1; i++) {
                        var oldPointIndex = this.points.length - this.drawingPoints - i - 1
                        if(oldPointIndex > -1) {
                            var oldPoint = this.points[oldPointIndex]
                            this.ctx.fillStyle = "black"
                            this.ctx.fillRect(oldPoint.x, oldPoint.y, 5, 5)
                        }
                    }
                }
            }
        },
        drawSpeed: function(newVal, oldVal) {
            for(let i=0; i<this.drawingFunctions.length; i++) {
                clearInterval(this.drawingFunctions[i])
            }
            this.drawingFunctions = []
            if(newVal > 0 && this.drawOnePointFunction != null) {
                this.drawSpeed = newVal
                for(let i=0; i<this.drawingPoints; i++) {
                    let newDrawingFunction = setInterval( (i) => this.drawOnePointFunction(i), 1000 / this.drawSpeed, i)
                    this.drawingFunctions[i] = newDrawingFunction
                }
            }
        }
    },
    methods: {
        startDraw() {
            if(this.corePoints.length > 1) {
                this.newX = this.startPoint.x
                this.newY = this.startPoint.y
            }
            this.drawOnePointFunction = (i) => {
                console.log(i)
                var random = Math.floor(Math.random() * (this.corePoints.length))
                this.newX = (this.corePoints[random].x + this.newX) / 2
                this.newY = (this.corePoints[random].y + this.newY) / 2
                var newPoint = {
                    x: this.newX, 
                    y: this.newY
                }
                this.startPoint = newPoint 
                this.points.push(newPoint)
                if(i === 0) {
                    this.ctx.fillStyle = 'red'
                } else {
                    this.ctx.fillStyle = 'green'
                }
                this.ctx.fillRect(this.newX, this.newY, 5, 5)
                if(this.points.length-this.drawingPoints > 0) {
                    var oldPointIndex = this.points.length - this.drawingPoints - 1
                    var oldPoint = this.points[oldPointIndex]
                    this.ctx.fillStyle = 'black'
                    this.ctx.fillRect(oldPoint.x, oldPoint.y, 5, 5)
                }
                if(this.points.length > 998) {
                    this.points.shift()
                }
            }
            if(this.corePoints.length > 1 && !this.drawingFunctionIsRunning && this.drawingPoints > 0 && this.drawSpeed > 0) {
                this.drawingFunctions = []
                for(let i=0; i<this.drawingPoints; i++) {
                    let newDrawingFunction = setInterval( (i) => this.drawOnePointFunction(i), 1000 / this.drawSpeed, i)
                    this.drawingFunctions[i] = newDrawingFunction
                }
                this.drawingFunctionIsRunning = true
            }
        },
        drawOnePoint() {
            this.drawOnePointFunction()
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
            this.drawOnePointFunction = null
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