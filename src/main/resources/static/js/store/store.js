import Vue from 'vue'
import Vuex from 'vuex'
import {objectToRgbFunction} from 'helpers/helpFunctions.js'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        drawingPoints: [
            { color: {r: 255, g: 0, b: 0}, customSpeed: false, speed: 1 }
        ],
        selectedNewPoint: 0,
        countDrawingPoints: 1,
        oldCountDrawingPoints:0,
        oldPoints: [
            { color: {r: 0, g: 0, b: 0} },
        ],
        selectedOldPoint: 0,
        corePoints: [],
        allPoints: [ [] ],
        selectedCorePoint: 0,
        startPoint: {
            x: null,
            y: null,
        },
        drawSpeed: 1,
        pointSize: 20,
        corePointSize: 15,
        drawingFunctionIsRunning: false,
        canvas: null,
        canvasCtx: null,
        drawingFunctions: [],
    },
    getters: {
        drawingPoints: state => state.drawingPoints,
        oldPoints: state => state.oldPoints,
        corePoints: state => state.corePoints,
        selectedOldPoint: state => state.selectedOldPoint,
        selectedNewPoint: state => state.selectedNewPoint,
        selectedCorePoint: state => state.selectedCorePoint,
        getCountDrawingPoints: state => state.countDrawingPoints,
        getPointSize: state => state.pointSize,
        getDrawSpeed: state => state.drawSpeed,
        allPoints: state => state.allPoints,
        corePointSize: state => state.corePointSize,
        oldCountDrawingPoints: state => state.oldCountDrawingPoints,
        drawingFunctionIsRunning: state => state.drawingFunctionIsRunning,
        canvas: state => state.canvas,
        canvasCtx: state => state.canvasCtx,
        drawingFunctions: state => state.drawingFunctions,
        startPoint: state => state.startPoint
    },
    mutations: {
        resetCanvas(state) {
            state.canvasCtx.clearRect(0, 0, state.canvas.width, state.canvas.height)
            state.corePoints = []
            state.allPoints = [  ]
            for(let i = 0; i < state.countDrawingPoints; i++) {
                state.allPoints.push([])
            }
            state.drawingFunctions = []
            state.startPoint = {x: null, y: null}
        },
        drawPoint(state, payload) {
            let x = payload.x
            let y = payload.y
            let pointSize = payload.pointSize
            let color = payload.color
            state.canvasCtx.fillStyle = color
            state.canvasCtx.fillRect(x, y, pointSize, pointSize)
        },
        pushNewPoint(state, payload) {
          let index = payload.index
          let point = payload.point
          state.allPoints[index].push(point)
        },
        cleanOldPoints(state) {
            state.allPoints = [ [] ]
        },
        recolorOldPointMutation(state, payload) {
            let i = payload.i
            let j = payload.j
            let color = payload.color
            state.allPoints[i][j].color = color
        },
        updateStartPoint(state, newPoint){
            state.startPoint = newPoint
        },
        stopDrawingFunctions(state) {
            state.drawingFunctions = []
            state.drawingFunctionIsRunning = false
        },
        runDrawingFunction(state, newFunction) {
            state.drawingFunctions.push(newFunction)
            state.drawingFunctionIsRunning = true
        },
        addCorePoint(state, payload) {
            let offsetX = payload.x
            let offsetY = payload.y
            if (state.startPoint.x == null && state.startPoint.y == null) {
                state.startPoint.x = offsetX
                state.startPoint.y = offsetY
            }
            let newCorePoint = {
                x: offsetX,
                y: offsetY,
                color: {r: 0, g: 0, b: 255},
                size: state.corePointSize,
            }
            state.corePoints.push(newCorePoint)
            state.canvasCtx.fillStyle = objectToRgbFunction(newCorePoint.color)
            state.canvasCtx.fillRect(offsetX, offsetY, newCorePoint.size, newCorePoint.size)
        },
        updateDrawSpeed(state, newVal) {
            if (newVal > 100) {
                state.drawSpeed = 100
            }
            else if (newVal <= 0 || newVal == "") {
                state.drawSpeed = 1
            } else {
                state.drawSpeed = newVal
            }
        },
        updateCountDrawingPoints (state, newValue) {
            if (newValue > 5) {
                state.countDrawingPoints = 5
            }
            else if (newValue <= 0 || newValue == '') {
                state.countDrawingPoints = 1
            } else {
                state.oldCountDrawingPoints = state.countDrawingPoints
                state.countDrawingPoints = newValue
            }
            let newVal = state.countDrawingPoints
            let oldVal = state.oldCountDrawingPoints
            if (newVal > oldVal && state.drawingPoints.length < newVal && state.oldPoints.length < newVal) {
                for (let i = 0; i < newVal - oldVal; i++) {
                    state.drawingPoints.push({
                        color: { r: 255, g: 0, b: 0 },
                        customSpeed: false,
                        speed: 1
                    })
                    state.allPoints.push( [] )
                    state.oldPoints.push( {color: {r: 0, g: 0, b: 0} } )
                }
            }
            // if (this.drawingFunctionIsRunning) {
            //     for(let i = 0; i < oldVal; i++) {
            //         this.recolorOldPoint(i)
            //     }
            //     this.restartAllDrawingFunctions()
            // }
        },
        updatePointSize(state, newVal) {
            if (newVal > 30) {
                state.pointSize = 30
            }
            else if (newVal <= 0 || newVal == '') {
                state.pointSize = 1
            } else {
                state.pointSize = newVal
            }
        },
        updateColors(state, payload) {
            let pointArrayType = payload.pointArrayType
            let updatedPoint = payload.updatedPoint
            if(pointArrayType == 'new') {
                state.drawingPoints[state.selectedNewPoint] = updatedPoint
            } else if (pointArrayType == 'old') {
                state.oldPoints[state.selectedOldPoint] = updatedPoint
            } else if (pointArrayType == 'core') {
                state.corePoints[state.selectedCorePoint] = updatedPoint
            }
        },
        updateColorSelector(state, payload) {
            let pointArrayType = payload.pointArrayType
            let selectedPoint = payload.selectedPoint
            if(pointArrayType == 'new') {
                state.selectedNewPoint = selectedPoint
            } else if (pointArrayType == 'old') {
                state.selectedOldPoint = selectedPoint
            } else if (pointArrayType == 'core') {
                state.selectedCorePoint = selectedPoint
            }
        },
        resetNewPointColors(state) {
            for(let i = 0; i < state.drawingPoints.length; i++) {
                state.drawingPoints[i].color = {r: 255, g: 0, b: 0}
                state.drawingPoints[i].customSpeed = false
                state.drawingPoints[i].speed = 1
            }
        },
        resetOldPointColors(state) {
            for(let i = 0; i < state.oldPoints.length; i++) {
                state.oldPoints[i].color = {r: 0, g: 0, b: 0}
            }
        },
        resetCorePointColors(state) {
            for(let i = 0; i < state.corePoints.length; i++) {
                state.corePoints[i].color = {r: 0, g: 0, b: 255}
            }
        },
        resetCoreSettings(state) {
            state.drawSpeed = 1
            state.pointSize = 20
            state.getCountDrawingPoints = 1
            state.corePointSize = 15
        },
        deleteCurrentCorePoint(state) {
            let x = state.corePoints[state.selectedCorePoint].x
            let y = state.corePoints[state.selectedCorePoint].y
            let color
            if(state.drawingFunctionIsRunning) {
                color = objectToRgbFunction(state.oldPoints[0].color)
            } else {
                color = 'white'
            }
            state.canvasCtx.fillStyle = color
            state.canvasCtx.fillRect(x, y, state.corePointSize, state.corePointSize)
            state.corePoints.splice(state.selectedCorePoint, 1)
        },
        initCanvas(state, canvas) {
            state.canvas = canvas
            state.canvasCtx = state.canvas.getContext('2d')
        }
    },
    actions: {
        resetAllSettings({commit}) {
            commit('resetCorePointColors')
            commit('resetNewPointColors')
            commit('resetOldPointColors')
        },
        addCorePointAction({commit, state}, payload) {
            let offsetX = payload.x
            let offsetY = payload.y
            let overlap = false
            for(let i = 0; i < state.corePoints.length; i++) {
                if(state.corePoints[i].x == offsetX && state.corePoints[i].y == offsetY) {
                    overlap = true
                }
            }
            if(!overlap) {
                commit('addCorePoint', {x: offsetX, y: offsetY})
            }
        }
    }
})