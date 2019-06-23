
export function objectToRgbFunction(pointColorObject) {
    return 'rgb(' + pointColorObject.r + ',' + pointColorObject.g + ',' + pointColorObject.b + ')'
}

export function paintPoint(canvasCtx, point) {
    let x = point.x
    let y = point.y
    let color = point.color
    let pointSize = point.size
    canvasCtx.fillStyle = objectToRgbFunction(color)
    canvasCtx.fillRect(x, y, pointSize, pointSize)
}

export function repaintDeletedCorePoint(state) {
    let color
    let currentCorePoint = state.corePoints[state.selectedCorePoint]
    if(state.drawingFunctionIsRunning) {
        color = state.oldPoints[0].color
    } else {
        color = {r: 255, g: 255, b: 255}
    }
    let pointToPaint = {
        x: currentCorePoint.x,
        y: currentCorePoint.y,
        color: color,
        size: state.pointSize
    }
    paintPoint(state.canvasCtx,  pointToPaint)
}

export function unknownPointArrayTypeError(pointArrayType, actionName) {
    console.error(actionName + ': [unknown pointArrayType ' + '[ ' + pointArrayType + ' - ' + typeof(pointArrayType) +' ] ]')
}

export function validateColors(colorObject) {
    for(let pointColor in colorObject) {
        colorObject[pointColor] = validateColor(colorObject[pointColor])
    }
}

function validateColor(color) {
    let resColor
    if(color > 255) {
        resColor = 255
    } else if(color < 0) {
        resColor = 0
    } else {
        resColor =  color
    }
    return resColor
}