<template>
    <div>
        <div class='row mt-3 ml-1'>
            <div v-for='(somePoint, index) in pointArray'>
                <div class='mx-2 smallColorBox'
                     :class="pointArray.length > 12 ? 'mt-2' : ''"
                     :id='pointArrayType + index'
                     :style='{ background: objectToRgbFunction(somePoint.color) }'
                     style='border: 1px solid black'
                     @click='changeSelectedPoint(index)'
                     @mouseover='addColorBoxStyle(pointArrayType + index)'
                     @mouseout='removeColorBoxStyle(pointArrayType + index)'>
                </div>
            </div>
            <button class='btn btn-primary ml-2'
                    :class="pointArray.length > 8 ? 'mt-2' : ''"
                    @click='resetPointColorsAction(pointArrayType)'>
                reset colors
            </button>
        </div>
        <b-form-select class='my-3 w-100' v-model='selectedPoint'>
            <option v-for='(oldPoint, index) in pointArray'
                    :value='index'>
                {{pointArrayType}} point: {{index+1}}
            </option>
        </b-form-select>

        <div v-if='pointArrayType === "core"'>
            <button v-if='pointArray.length > 2 || !drawingFunctionIsRunning'
                    class='btn btn-danger' @click='deleteCurrentCorePointAction'>
                delete this point
            </button>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions} from 'vuex'
    import {objectToRgbFunction} from 'helpers/helpFunctions.js'

    export default {
        props: ['pointArrayType'],
        name: "colorSelector",
        data() {
            return {
                marginClass: 'mt-1',
                objectToRgbFunction: objectToRgbFunction
            }
        },
        computed: {
            ...mapState(['drawingFunctionIsRunning']),
            pointArray: {
                get() { return this.$store.getters.getPointArray(this.pointArrayType) }
            },
            selectedPoint: {
                get() { return this.$store.getters.getSelectedPoint(this.pointArrayType) },
                set(newVal) {
                    this.updateColorSelectorAction({
                        selectedPoint: newVal,
                        pointArrayType: this.pointArrayType
                    })
                }
            }
        },
        methods: {
            ...mapActions(['resetPointColorsAction', 'updateColorSelectorAction', 'deleteCurrentCorePointAction']),
            addColorBoxStyle(id) {
                let colorBox = document.getElementById(id)
                colorBox.style.outline = '2px solid rgb(0,150,255)'
            },
            removeColorBoxStyle(id) {
                let colorBox = document.getElementById(id)
                colorBox.style.outline = ''
            },
            changeSelectedPoint(index) {
                this.selectedPoint = index
            },
        }
    }
</script>

<style scoped>
    .smallColorBox {
        width: 20px;
        height: 20px;
    }
</style>