<template>
    <div>
        <div v-if='pointArrayType == "new"'>
            <label class='justify-content-start'>
                <b-form-checkbox class='mt-2' v-model="pointArray[selectedPoint].customSpeed"/>
                speed:
                <input class='form-control ml-2 mt-2'
                       :disabled='!pointArray[selectedPoint].customSpeed'
                       v-model='pointArray[selectedPoint].speed'/>
            </label>
            <input class='custom-range mt-2'
                   :disabled='!pointArray[selectedPoint].customSpeed'
                   v-model='pointArray[selectedPoint].speed'
                   type='range'
                   min='1' max='100'>
        </div>
        <label class='justify-content-start' for='pointRed'>{{pointArrayType}} red:
            <input class='form-control ml-2 mt-2' v-model='pointArray[selectedPoint].color.r'/>
        </label>
        <input class='custom-range mt-2'
               v-model='pointArray[selectedPoint].color.r'
               id='pointRed'
               type='range'
               min='0' max='255'>

        <label class='justify-content-start' for='pointGreen'>{{pointArrayType}} green:
            <input class='form-control ml-2 mt-2' v-model='pointArray[selectedPoint].color.g'/>
        </label>
        <input class='custom-range mt-2'
               v-model='pointArray[selectedPoint].color.g'
               id='pointGreen'
               type='range'
               min='0' max='255'>

        <label class='justify-content-start' for='pointBlue'>{{pointArrayType}} blue:
            <input class='form-control ml-2 mt-2' v-model='pointArray[selectedPoint].color.b'/>
        </label>
        <input class='custom-range mt-2'
               v-model='pointArray[selectedPoint].color.b'
               id='pointBlue'
               type='range'
               min='0' max='255'>

        <div class='mx-2 mt-2 commonColorBox'
             style='border: 2px solid black;'
             :style='{ background: objectToRgbFunction(pointArray[selectedPoint].color) } '>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import {objectToRgbFunction} from 'helpers/helpFunctions.js'
    export default {
        props: ['pointArrayType', 'restartAllDrawingFunctions'],
        data() {
            return {
                objectToRgbFunction: objectToRgbFunction
            }
        },
        watch: {
            pointArray: {
                handler(){
                    this.updatePointDataAction({
                        pointArrayType: this.pointArrayType,
                        updatedPoint: this.pointArray[this.selectedPoint]
                    })
                    if(this.drawingFunctionIsRunning) {
                        this.restartAllDrawingFunctions()
                    }
                },
                deep: true
            }
        },
        computed: {
            ...mapState(['drawingFunctionIsRunning']),
            pointArray: {
                get() { return this.$store.getters.getPointArray(this.pointArrayType) }
            },
            selectedPoint: {
                get() { return this.$store.getters.getSelectedPoint(this.pointArrayType) }
            }
        },
        methods: {
            ...mapActions(['updatePointDataAction']),
        }
    }
</script>

<style scoped>
    .commonColorBox {
        width: 50px;
        height: 50px;
    }
</style>