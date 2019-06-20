<template>
    <div>
        <div v-if='pointArrayType == "new"'>
            <label>
                <b-form-checkbox class='mt-2'
                                 v-model="pointArray[selectedPoint].customSpeed"></b-form-checkbox>
                point speed:
                <input :disabled='!pointArray[selectedPoint].customSpeed'
                       class='form-control ml-2 mt-2'
                       v-model='pointArray[selectedPoint].speed'/>
            </label>
            <input :disabled='!pointArray[selectedPoint].customSpeed'
                   type='range'
                   v-model='pointArray[selectedPoint].speed'
                   class='custom-range mt-2' min='1' max='100'>
            </div>
        <label>{{pointArrayType}} point red:
            <input class='form-control ml-2 mt-2'
                   v-model='pointArray[selectedPoint].color.r'/>
        </label>
        <input type='range'
               v-model='pointArray[selectedPoint].color.r'
               class='custom-range mt-2'
               min='0' max='255'>

        <label>{{pointArrayType}} point blue:
            <input class='form-control ml-2 mt-2'
                   v-model='pointArray[selectedPoint].color.g'/>
        </label>
        <input type='range'
               v-model='pointArray[selectedPoint].color.g'
               class='custom-range mt-2'
               min='0' max='255'>

        <label>{{pointArrayType}} point green:
            <input class='form-control ml-2 mt-2'
                   v-model='pointArray[selectedPoint].color.b'/>
        </label>
        <input type='range'
               v-model='pointArray[selectedPoint].color.b'
               class='custom-range mt-2'
               min='0' max='255'>

        <div class='mx-2 mt-2 commonColorBox'
             style='border: 2px solid black;'
             :style='{ background: objectToRgbFunction(pointArray[selectedPoint].color) } '>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {objectToRgbFunction} from 'helpers/helpFunctions.js'
    export default {
        props: ['pointArrayType'],
        data() {
            return {
                objectToRgbFunction: objectToRgbFunction
            }
        },
        watch: {
            pointArray: {
                handler(){
                    this.updatePointColorsAction({
                        pointArrayType: this.pointArrayType,
                        updatedPoint: this.pointArray[this.selectedPoint]
                    })
                },
                deep: true
            }
        },
        computed: {
            pointArray: {
                get() { return this.$store.getters.getPointArray(this.pointArrayType) }
            },
            selectedPoint: {
                get() { return this.$store.getters.getSelectedPoint(this.pointArrayType) }
            }
        },
        methods: {
            ...mapActions(['updatePointColorsAction']),
        }
    }
</script>

<style scoped>
    .commonColorBox {
        width: 50px;
        height: 50px;
    }
</style>