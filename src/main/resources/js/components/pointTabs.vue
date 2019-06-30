<template>
    <div class='form-inline'>
        <b-tabs class='mt-3 col-sm'>
            <b-tab title='new point'>
                <pointSelector :pointArrayType='"new"'/>
                <pointColors :pointArrayType='"new"'
                             :restartAllDrawingFunctions='restartAllDrawingFunctions'/>
            </b-tab>
            <b-tab title='old point'>
                <pointSelector :pointArrayType='"old"'/>
                <pointColors :pointArrayType='"old"'
                             :restartAllDrawingFunctions='restartAllDrawingFunctions'/>
            </b-tab>
            <b-tab title='core point' :disabled='corePoints.length === 0'>
                <div v-if='corePoints.length > 0'>
                    <pointSelector :pointArrayType='"core"'/>
                    <pointColors :pointArrayType="'core'"
                                 :restartAllDrawingFunctions='restartAllDrawingFunctions'/>
                </div>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import pointColors from 'components/pointColors.vue'
    import pointSelector from 'components/pointSelector.vue'

    export default {
        name: "pointTabs",
        props: ['restartAllDrawingFunctions'],
        components: {
            pointColors,
            pointSelector,
        },
        computed:
            mapState(['corePoints'])
    }
</script>

<style scoped>

</style>