<template>
    <div class='container-fluid'>
        <nav class='navbar navbar-expand-lg navbar-primary navbar-default bg-light scrolling-navbar shadow'>
            <div class='navbar-nav mr-auto'>
                <li class='nav-item'>
                    <button class="openSidebarBtn mr-2"
                            @click="sidebarOpened ? closeNav() : openNav()">&#9776;
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

                        <div class='mt-4'>
                            <coreControls />
                            <pointTabs :restartAllDrawingFunctions='restartAllDrawingFunctions'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class='row mt-4 ml-1'>
            <div class='col-lg col-5-sm'>
                <div>
                    <b-alert v-if='showAlert'
                             show dismissible
                             :dismissed='!showAlert'>
                        Put two and more points on the canvas and click 'start' on sidebar
                        <a href='javascript:void(0)' @click='dontShowAlert'> (dont show again and close)</a>
                    </b-alert>
                </div>
                <a download="OrderlyChaos.png"
                   :href='image'
                   @click='downloadImage'>
                    <button class='btn btn-primary my-2' type="button">Download image</button>
                </a>
                <canvas id='canv'
                        class='mr-3'
                        width='1840'
                        height='1000'
                        style='border: 2px solid black'
                        @click='addCorePoint'>
                </canvas>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapState, mapActions} from 'vuex'
    import coreControls from 'components/coreControls.vue'
    import coreButtons from 'components/coreButtons.vue'
    import feedbackModal from 'components/feedbackModal.vue'
    import pointTabs from 'components/pointTabs.vue'

    export default {
        name: 'Canv',
        components: {
            coreControls,
            coreButtons,
            feedbackModal,
            pointTabs
        },
        data() {
            return {
                sidebar: null,
                sidebarOpened: false,
                image: null,
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
            this.initCanvasMutation(document.getElementById('canv'))
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
                'recolorOldPointMutation', 'offShowAlertMutation',
                'updateMovingPointMutation', 'cleanAllPointsArrayMutation']),
            downloadImage() {
                this.image = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
            },
            addCorePoint(event) {
                let offsetX = event.offsetX
                let offsetY = event.offsetY
                this.addCorePointAction({ x: offsetX, y: offsetY })
                if (!this.drawingFunctionIsRunning && this.corePoints.length > 1) {
                    this.makeStartPoint()
                }
            },
            makeStartPoint() {
                let randomFirstPoint = Math.floor(Math.random() * (this.corePoints.length))
                let randomSecondPoint = Math.floor(Math.random() * (this.corePoints.length))
                this.movingPoint.x = (this.corePoints[randomFirstPoint].x + this.corePoints[randomSecondPoint].x) / 2
                this.movingPoint.y = (this.corePoints[randomFirstPoint].y + this.corePoints[randomSecondPoint].y) / 2
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
                    this.drawingFunctions.push(newDrawingFunction)
                }
                this.startDrawingFunctionMutation()
            },
            stopAllDrawingFunctions() {
                for (let i = 0; i < this.drawingFunctions.length; i++) {
                    clearInterval(this.drawingFunctions[i])
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
                this.movingPoint.x = newX
                this.movingPoint.y = newY
                let newPoint = {
                    x: newX,
                    y: newY,
                    size: this.pointSize,
                    color: this.drawingPoints[drawingPointNumber].color
                }
                this.addNewPointMutation({
                    index: drawingPointNumber,
                    point: newPoint
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
            openNav() {
                this.sidebar.style.width = "40%"
                this.sidebarOpened = true
            },
            closeNav() {
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