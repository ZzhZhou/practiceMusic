<template>
    <div class="playlist">
      <div class="minplayer">23333</div>
      <div class="maxplayer"></div>
    </div>
</template>
<script>
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
    export default {
        methods:{
          ...mapMutations({
            openCloseList:'openCloseList'
          })
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .minplayer{}
</style>
