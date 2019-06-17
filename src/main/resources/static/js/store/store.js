import Vue from 'vue'
import Vuex from 'vuex'

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
        drawSpeed: 1,
        pointSize: 20,
        corePointSize: 15,
        drawingFunctionIsRunning: false,
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
        objectToRgbFunction: state => pointColorObject => {
            return 'rgb(' + pointColorObject.r + ',' + pointColorObject.g + ',' + pointColorObject.b + ')'        }
    },
    mutations: {
        updateDrawSpeed(state, newVal) {
            if (newVal > 100) {
                state.pointSize = 5
            }
            else if (newVal <= 0) {
                state.pointSize = 1
            }
            if(typeof(newVal) != "number") {
                console.error('updateDrawSpeed error point speed < 100 and >= 0 ' +
                                '[' +  newVal + ' ' + typeof(newVal) +']')
            }
        },
        updateCountDrawingPoints (state, newValue) {
            state.oldCountDrawingPoints = state.countDrawingPoints
            state.countDrawingPoints = newValue
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
                if (newVal > 5) {
                    state.drawingPoints.lenght = 5
                    state.countDrawingPoints = 5
                }
                else if (newVal <= 0) {
                    state.drawingPoints.lenght = 1
                    state.countDrawingPoints = 1
                }
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
            else if (newVal <= 0) {
                state.pointSize = 1
            }
            if(typeof(newVal) != "number") {
                console.error('updatePointSize error point size < 30 and >= 0' +
                                '[' +  newVal + ' ' + typeof(newVal) +']')
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
                state.drawingPoints[i] = {
                    color: {r: 255, g: 0, b: 0},
                    customSpeed: false,
                    speed: 1
                }
            }
        },
        resetOldPointColors(state) {
            for(let i = 0; i < state.oldPoints.length; i++) {
                state.oldPoints[i] = { color: {r: 0, g: 0, b: 0} }
            }
        },
        resetCorePointColors(state) {
            for(let i = 0; i < state.corePoints.length; i++) {
                state.corePoints[i].color = {r: 0, g: 0, b: 255}
                state.corePoints[i].size = state.corePointSize
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
                color = getters.objectToRgbFunction(state.oldPoints[0].color)
            } else {
                color = 'white'
            }
            state.canvasCtx.fillStyle = color
            state.canvasCtx.fillRect(x, y, state.corePointSize, state.corePointSize)
            state.corePoints.splice(state.selectedCorePoint, 1)
        },
    },
    actions: {
        resetAllSettings({commit}) {
            commit('resetCorePointColors')
            commit('resetCorePointColors')
            commit('resetOldPointColors')
        },
    }
})