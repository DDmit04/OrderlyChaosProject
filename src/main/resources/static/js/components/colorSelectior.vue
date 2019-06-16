<template>
    <div>
        <div class='row mt-3 ml-1'>
            <div v-for='(somePoint, index) in pointArray'>
                <div class='mx-2 smallColorBox'
                     :style='{ background: objectToRgbFunction(somePoint.color) }'
                     :id='point + index'
                     @click='selectedPoint = index'
                     @mouseover='addColorBoxStyle(point + index)'
                     @mouseout='removeColorBoxStyle(point + index)'>
                </div>
            </div>
            <button class='btn btn-primary ml-2' @click='resetPointColors'>
                reset colors
            </button>
        </div>
        <b-form-select class='my-3 w-100' v-model='selectedPoint'>
            <option v-for='(oldPoint, index) in pointArray'
                    :value='pointArray.indexOf(oldPoint)'>
                {{point}} point: {{index+1}}
            </option>
        </b-form-select>
<!--        <div v-if='point == "core"'>-->
<!--            <button v-if='corePoints.length > 2 || !drawingFunctionIsRunning'-->
<!--                    class='btn btn-danger' @click='deleteCurrentCorePoint'>-->
<!--                delete this point-->
<!--            </button>-->
<!--        </div>-->
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    export default {
        props: ['point', 'objectToRgbFunction'],
        name: "colorSelector",
        computed: {
            resetPointColors: {
                get() {
                    if(this.point == 'new') {
                        return this.resetNewPointColors
                    } else if (this.point == 'old') {
                        return this.resetNewPointColors
                    } else if (this.point == 'core') {
                        return this.resetCorePointColors
                    } else {
                        console.error('unknown point type ' +
                            '[' + this.point + ' ' + typeof(this.point) + ']')
                    }
                }
            },
            pointArray: {
                get() {
                    if(this.point == 'new') {
                        return this.$store.state.drawingPoints.slice(0, this.pointsCount)
                    } else if (this.point == 'old') {
                        return this.$store.state.oldPoints.slice(0, this.pointsCount)
                    } else if (this.point == 'core') {
                        return this.$store.state.corePoints.slice(0, this.pointsCount)
                    } else {
                        console.error('unknown point type ' +
                            '[' + this.point + ' ' + typeof(this.point) + ']')
                    }
                }
            },
            pointsCount: {
                get() {
                    return this.$store.state.countDrawingPoints
                }
            },
            selectedPoint: {
                get() {
                    if(this.point == 'new') {
                        return this.$store.state.selectedNewPoint
                    } else if (this.point == 'old') {
                        return this.$store.state.selectedOldPoint
                    } else if (this.point == 'core') {
                        return this.$store.state.selectedCorePoint
                    } else {
                        console.error('unknown point type ' +
                            '[' + this.point + ' ' + typeof(this.point) + ']')
                    }
                },
                set(newVal) {
                    this.updateColorSelector({selectedPoint: newVal, pointArrayType: this.point})
                }
            }
        },
        methods: {
            ...mapMutations(['updateColorSelector', 'resetCorePointColors',
                            'resetNewPointColors', 'resetOldPointColors']),
            addColorBoxStyle(id) {
                let colorBox = document.getElementById(id)
                colorBox.style.outline = '2px solid rgb(0,150,255)'
            },
            removeColorBoxStyle(id) {
                let colorBox = document.getElementById(id)
                colorBox.style.outline = ''
            },
        }
    }
</script>

<style scoped>

</style>