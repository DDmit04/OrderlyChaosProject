<template>
    <div class='container-fluid'>
        <nav class='navbar navbar-expand-lg navbar-primary navbar-default bg-light scrolling-navbar shadow'>
            <div class='navbar-nav mr-auto'>
                <li class='nav-item'>
                    <button class="openSidebarBtn mr-2"
                            @click="sidebarOpened ? closeSidebar() : openSidebar()">&#9776;
                    </button>
                    <a class="navbar-brand">Orderly Chaos</a>
                </li>
            </div>
            <ul class="nav justify-content-end">
                <feedbackModal/>
            </ul>
        </nav>

        <div id="sidebar" class="sidebar">
            <div class='col-lg'>
                <div class='card mb-2'>
                    <div class='card-body'>

                        <coreButtons :drawOnePointFunction='drawOnePointFunction'
                                     :startAllDrawingFunctions='startAllDrawingFunctions'
                                     :stopAllDrawingFunctions='stopAllDrawingFunctions'/>
                        <coreControls class='mt-4'/>
                        <pointTabs :restartAllDrawingFunctions='restartAllDrawingFunctions'/>

                    </div>
                </div>
            </div>
        </div>

        <div class='row mt-4 ml-1'>
            <div  class='col-lg col-5-sm'>
                <canvasComponent :movingPoint='movingPoint'
                                 :updateMovingPoint='updateMovingPoint'/>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapMutations, mapState} from 'vuex'
    import coreControls from 'components/coreControls.vue'
    import coreButtons from 'components/coreButtons.vue'
    import feedbackModal from 'components/feedbackModal.vue'
    import pointTabs from 'components/pointTabs.vue'
    import canvasComponent from 'components/canvasComponent.vue'

    export default {
        name: 'Canv',
        components: {
            coreControls,
            coreButtons,
            feedbackModal,
            pointTabs,
            canvasComponent
        },
        data() {
            return {
                sidebar: null,
                sidebarOpened: false,
                movingPoint: {
                    x: null,
                    y: null
                },
                drawingFunctions: []
            }
        },
        computed:
            mapState(['drawingPoints', 'corePoints', 'showAlert',
                    'countDrawingPoints', 'pointSize', 'canvas',
                    'drawSpeed', 'allPoints', 'allPointsLimit',
                    'oldCountDrawingPoints', 'drawingFunctionIsRunning']),
        mounted: function () {
            this.sidebar = document.getElementById('sidebar')
        },
        watch: {
            drawingPoints: function() {
                if(this.drawingFunctionIsRunning) {
                    this.restartAllDrawingFunctions()
                }
            },
            drawSpeed: function () {
                if(this.drawingFunctionIsRunning) {
                    this.restartAllDrawingFunctions()
                }
            },
            countDrawingPoints: function () {
                if(this.drawingFunctionIsRunning) {
                    for (let i = 0; i < this.oldCountDrawingPoints; i++) {
                        this.recolorOldPoint(i)
                    }
                    this.restartAllDrawingFunctions()
                }
            },
            pointSize: function () {
                if(this.drawingFunctionIsRunning) {
                    this.restartAllDrawingFunctions()
                }
            }
        },
        methods: {
            ...mapActions(['addCorePointAction']),
            ...mapMutations(['initCanvasMutation', 'addNewPointMutation',
                'startDrawingFunctionMutation', 'stopDrawingFunctionsMutation',
                'recolorOldPointMutation', 'offShowAlertMutation', 'changeCanvasSizeMutation',
                'updateMovingPointMutation', 'cleanAllPointsArrayMutation']),
            updateMovingPoint(newX, newY) {
                this.movingPoint = {
                    x: newX,
                    y: newY
                }
            },
            startAllDrawingFunctions() {
                for (let drawingPointNumber = 0; drawingPointNumber < this.countDrawingPoints; drawingPointNumber++) {
                    let drawSpeed
                    if(this.drawingPoints[drawingPointNumber].customSpeed) {
                        drawSpeed = this.drawingPoints[drawingPointNumber].speed
                    } else {
                        drawSpeed = this.drawSpeed
                    }
                    let newDrawingFunction = setInterval(
                        (i) => this.drawOnePointFunction(i), 1000 / drawSpeed, drawingPointNumber
                    )
                    this.drawingFunctions.push(newDrawingFunction)
                }
                this.startDrawingFunctionMutation()
            },
            stopAllDrawingFunctions() {
                for (let drawingPointNumber = 0; drawingPointNumber < this.drawingFunctions.length; drawingPointNumber++) {
                    clearInterval(this.drawingFunctions[drawingPointNumber])
                }
                this.drawingFunctions = []
                this.stopDrawingFunctionsMutation()
            },
            restartAllDrawingFunctions() {
                this.stopAllDrawingFunctions()
                this.startAllDrawingFunctions()
            },
            drawOnePointFunction(drawingPointNumber) {
                if (this.allPoints[drawingPointNumber].length - 1 >= 0) {
                    this.recolorOldPoint(drawingPointNumber)
                }
                let random = Math.floor(Math.random() * (this.corePoints.length))
                let newX = (this.corePoints[random].x + this.movingPoint.x) / 2
                let newY = (this.corePoints[random].y + this.movingPoint.y) / 2
                this.updateMovingPoint(newX, newY)
                let newPoint = {
                    x: newX,
                    y: newY,
                    size: this.pointSize,
                    color: this.drawingPoints[drawingPointNumber].color
                }
                this.addNewPointMutation({
                    point: newPoint,
                    index: drawingPointNumber
                })
                if(this.allPoints[drawingPointNumber].length > this.allPointsLimit) {
                    this.cleanAllPointsArrayMutation(drawingPointNumber)
                }
            },
            recolorOldPoint(drawingPointNumber) {
                let oldPointIndex = this.allPoints[drawingPointNumber].length - 1
                if (oldPointIndex > -1) {
                    let oldPoint = this.allPoints[drawingPointNumber][oldPointIndex]
                    this.recolorOldPointMutation({
                        oldPoint: oldPoint,
                        drawingPointNumber: drawingPointNumber,
                        oldPointIndex: oldPointIndex
                    })
                }
            },
            openSidebar() {
                this.sidebar.style.width = "42%"
                this.sidebarOpened = true
            },
            closeSidebar() {
                this.sidebar.style.width = "0"
                this.sidebarOpened = false
            },
            dontShowAlert() {
                this.offShowAlertMutation()
            },
        }
    }
</script>
<style>
    .sidebar {
        height: 100%;
        width: 0;
        position: absolute;
        z-index: 1;
        top: 80px;
        left: 0;
        overflow-x: hidden;
        transition: 0.5s;
    }
    .openSidebarBtn {
        font-size: 20px;
        cursor: pointer;
        background-color: dodgerblue;
        color: white;
        padding: 10px 15px;
        border: none;
    }
    .openSidebarBtn:hover {
        outline: 2px solid rgb(0,150,255)
    }
</style>