<template>
    <div>
        <div v-if='point == "new"'>
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
        <label>{{point}} point red:
            <input class='form-control ml-2 mt-2'
                   v-model='pointArray[selectedPoint].color.r'/>
        </label>
        <input type='range'
               v-model='pointArray[selectedPoint].color.r'
               class='custom-range mt-2'
               min='0' max='255'>

        <label>{{point}} point blue:
            <input class='form-control ml-2 mt-2'
                   v-model='pointArray[selectedPoint].color.g'/>
        </label>
        <input type='range'
               v-model='pointArray[selectedPoint].color.g'
               class='custom-range mt-2'
               min='0' max='255'>

        <label>{{point}} point green:
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
    import {mapMutations} from 'vuex'
    export default {
        props: ['point', 'objectToRgbFunction'],
        computed: {
            pointArray: {
                get() {
                    if(this.point == 'new') {
                        return this.$store.state.drawingPoints
                    } else if (this.point == 'old') {
                        return this.$store.state.oldPoints
                    } else if (this.point == 'core') {
                        return this.$store.state.corePoints
                    } else {
                        console.error('unknown point type ' +
                            '[' + this.point + ' ' + typeof(this.point) + ']')
                    }
                },
                set() {
                    this.updateColors({pointArrayType: this.point, updatedPoint: this.pointArray[this.selectedPoint]})
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
                }
            }
        },
        methods: {
            ...mapMutations(['updateColors']),
        }
    }
</script>

<style scoped>

</style>