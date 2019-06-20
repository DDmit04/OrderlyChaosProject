import Vue from 'vue'
import Vuex from 'vuex'
import {paintPoint, repaintDeletedCorePoint,
        unknownPointArrayTypeError} from 'helpers/helpFunctions.js'

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
        canvas: null,
        canvasCtx: null,
        drawingFunctions: [],
    },
    getters: {

        getPointArray: (state) => (context) => {
            if (context == 'new') {
                return state.drawingPoints.slice(0, state.countDrawingPoints)
            } else if (context == 'old') {
                return state.oldPoints.slice(0, state.countDrawingPoints)
            } else if (context == 'core') {
                return state.corePoints
            }
        },
        getSelectedPoint: (state) => (context) => {
            if(context == 'new') {
                return state.selectedNewPoint
            } else if (context == 'old') {
                return state.selectedOldPoint
            } else if (context == 'core') {
                return state.selectedCorePoint
            }
        },
    },
    mutations: {
        cleanAllPointsArrayMutation(state, drawingPointNumber) {
            state.allPoints[drawingPointNumber].splice(0, 90)
        },
        resetCanvasMutation(state) {
            state.canvasCtx.clearRect(0, 0, state.canvas.width, state.canvas.height)
            state.corePoints = []
            state.allPoints = []
            state.drawingFunctions = []
            state.startPoint = {x: null, y: null}
        },
        addNewPointMutation(state, payload) {
            let index = payload.index
            let point = payload.pointArrayType
            state.allPoints[index].push(point)
            paintPoint(state.canvasCtx,  point)
        },
        cleanOldPointsMutation(state) {
            state.canvasCtx.clearRect(0, 0, state.canvas.width, state.canvas.height)
            state.allPoints = [ [] ]
        },
        recolorOldPointMutation(state, payload) {
            let drawingPointNumber = payload.drawingPointNumber
            let oldPoint = payload.oldPoint
            let color = state.oldPoints[drawingPointNumber].color
            let pointToPaint = {
                x: oldPoint.x,
                y: oldPoint.y,
                color: color,
                size: oldPoint.size
            }
            state.allPoints[drawingPointNumber][payload.oldPointIndex].color = color
            paintPoint(state.canvasCtx,  pointToPaint)
        },
        stopDrawingFunctionsMutation(state) {
            for (let i = 0; i < state.drawingFunctions.length; i++) {
                clearInterval(state.drawingFunctions[i])
            }
            state.drawingFunctions = []
            state.drawingFunctionIsRunning = false
        },
        runDrawingFunctionMutation(state, newFunction) {
            state.drawingFunctions.push(newFunction)
            state.drawingFunctionIsRunning = true
        },
        addCorePointMutation(state, payload) {
            let offsetX = payload.x
            let offsetY = payload.y
            let newCorePoint = {
                x: offsetX,
                y: offsetY,
                color: {r: 0, g: 0, b: 255},
                size: state.corePointSize,
            }
            state.corePoints.push(newCorePoint)
            paintPoint(state.canvasCtx,  newCorePoint)
        },
        updateDrawSpeedMutation(state, newDrawSpeed) {
            state.drawSpeed = newDrawSpeed
        },
        updateCountDrawingPointsMutation (state, newCountDrawingPoints) {
            state.oldCountDrawingPoints = state.countDrawingPoints
            state.countDrawingPoints = newCountDrawingPoints
        },
        addDrawingPointSlotMutation(state) {
            state.drawingPoints.push({
                color: { r: 255, g: 0, b: 0 },
                customSpeed: false,
                speed: 1
            })
        },
        addAllPointSlotMutation(state) {
            state.allPoints.push( [] )
        },
        addOldPointSlotMutation(state) {
            state.oldPoints.push( {color: {r: 0, g: 0, b: 0} } )
        },
        updatePointSizeMutation(state, newPointSize) {
            state.pointSize = newPointSize
        },
        updateNewPointColorMutation(state, updatedPoint) {
            state.drawingPoints[state.selectedNewPoint] = updatedPoint
        },
        updateOldPointColorMutation(state, updatedPoint) {
            state.oldPoints[state.selectedOldPoint] = updatedPoint
        },
        updateCorePointColorMutation(state, updatedPoint) {
            state.corePoints[state.selectedCorePoint] = updatedPoint
            paintPoint(state.canvasCtx,  updatedPoint)
        },
        updateSelectedNewPointMutation(state, selectedPoint) {
            state.selectedNewPoint = selectedPoint
        },
        updateSelectedCorePointMutation(state, selectedPoint) {
            state.selectedCorePoint = selectedPoint
        },
        updateSelectedOldPointMutation(state, selectedPoint) {
            state.selectedOldPoint = selectedPoint
        },
        resetNewPointColorsMutation(state) {
            for(let i = 0; i < state.drawingPoints.length; i++) {
                state.drawingPoints[i].color = {r: 255, g: 0, b: 0}
                state.drawingPoints[i].customSpeed = false
                state.drawingPoints[i].speed = 1
            }
        },
        resetOldPointColorsMutation(state) {
            for(let i = 0; i < state.oldPoints.length; i++) {
                state.oldPoints[i].color = {r: 0, g: 0, b: 0}
            }
        },
        resetCorePointColorsMutation(state) {
            for(let i = 0; i < state.corePoints.length; i++) {
                state.corePoints[i].color = {r: 0, g: 0, b: 255}
                paintPoint(state.canvasCtx,  state.corePoints[i])
            }
        },
        resetCoreSettings(state) {
            state.drawSpeed = 1
            state.pointSize = 20
            state.getCountDrawingPoints = 1
            state.corePointSize = 15
        },
        deleteCurrentCorePointMutation(state) {
            let selectedCorePoint = state.selectedCorePoint
            state.corePoints.splice(selectedCorePoint, 1)
            if(selectedCorePoint > 0) {
                state.selectedCorePoint = selectedCorePoint - 1
            }
        },
        initCanvasMutation(state, canvas) {
            state.canvas = canvas
            if(canvas.getContext == null) {
                console.error('init canvas context error')
            } else {
                state.canvasCtx = canvas.getContext('2d')
            }
        }
    },
    actions: {
        deleteCurrentCorePointAction({state, commit}) {
            repaintDeletedCorePoint(state)
            commit('deleteCurrentCorePointMutation')
        },
        resetAllSettingsAction({commit}) {
            commit('resetCorePointColorsMutation')
            commit('resetNewPointColorsMutation')
            commit('resetOldPointColorsMutation')
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
                commit('addCorePointMutation', {x: offsetX, y: offsetY})
            }
        },
        resetPointColorsAction({commit}, pointArrayType) {
            if (pointArrayType == 'new') {
                commit('resetNewPointColorsMutation')
            } else if (pointArrayType == 'old') {
                commit('resetOldPointColorsMutation')
            } else if (pointArrayType == 'core') {
                commit('resetCorePointColorsMutation')
            } else {
                unknownPointArrayTypeError(pointArrayType)
            }
        },
        updateColorSelectorAction({commit}, payload) {
            let pointArrayType = payload.pointArrayType
            let selectedPoint = payload.selectedPoint
            if(pointArrayType == 'new') {
                commit('updateSelectedNewPointMutation', selectedPoint)
            } else if (pointArrayType == 'old') {
                commit('updateSelectedOldPointMutation', selectedPoint)
            } else if (pointArrayType == 'core') {
                commit('updateSelectedCorePointMutation', selectedPoint)
            } else {
                unknownPointArrayTypeError(pointArrayType)
            }
        },
        updatePointColorsAction({commit}, payload) {
            let pointArrayType = payload.pointArrayType
            let updatedPoint = payload.updatedPoint
            if(pointArrayType == 'new') {
                commit('updateNewPointColorMutation', updatedPoint)
            } else if (pointArrayType == 'old') {
                commit('updateOldPointColorMutation', updatedPoint)
            } else if (pointArrayType == 'core') {
                commit('updateCorePointColorMutation', updatedPoint)
            } else {
                unknownPointArrayTypeError(pointArrayType)
            }
        },
        updatePointSizeAction({commit}, newVal) {
            let newPointSize
            if (newVal > 30) {
                newPointSize = 30
            }
            else if (newVal <= 0 || newVal == '') {
                newPointSize = 1
            } else {
                newPointSize = newVal
            }
            commit('updatePointSizeMutation', newPointSize)
        },
        updateCountDrawingPointsAction({commit, dispatch}, newValue) {
            let newCountDrawingPoints
            if (newValue > 5) {
                newCountDrawingPoints = 5
            }
            else if (newValue <= 0 || newValue == '') {
                newCountDrawingPoints = 1
            } else {
                newCountDrawingPoints = newValue
            }
            commit('updateCountDrawingPointsMutation', newCountDrawingPoints)
            dispatch('addPointSlotsAction')
        },
        addPointSlotsAction({state, commit}) {
            let newVal = state.countDrawingPoints
            let oldVal = state.oldCountDrawingPoints
            if (newVal > oldVal && state.drawingPoints.length < newVal && state.oldPoints.length < newVal) {
                for (let i = 0; i < newVal - oldVal; i++) {
                    commit('addDrawingPointSlotMutation')
                    commit('addAllPointSlotMutation')
                    commit('addOldPointSlotMutation')
                }
            }
        },
        updateDrawSpeedAction({commit}, newVal) {
            let newDrawSpeed
            if (newVal > 100) {
                newDrawSpeed = 100
            }
            else if (newVal <= 0 || newVal == "") {
                newDrawSpeed = 1
            } else {
                newDrawSpeed = newVal
            }
            commit('updateDrawSpeedMutation', newDrawSpeed)
        },
        resetCanvasAction({commit, state}) {
            commit('resetCanvasMutation')
            for(let i = 0; i < state.countDrawingPoints; i++) {
                commit('addAllPointSlotMutation')
            }
        },
        cleanOldPointsAction({state, commit}) {
            commit('cleanOldPointsMutation')
            for(let i = 0; i < state.corePoints.length; i++) {
                let corePoint = state.corePoints[i]
                paintPoint(state.canvasCtx, corePoint)
            }
        }
    }
})