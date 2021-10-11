<template>
    <div class="ksong">
      <div class="loading">
        <img src="../../../assets/images/loading7.gif"  alt="">
        <span>努力搭建中......</span>
      </div>
    </div>
</template>
<script>
    export default {}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .ksong{
    font-size: 10px;
  }
  .loading{
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .loading img{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 55em;
    height: 40em;
    margin-left: -27.5em;
    margin-top: -20em;
  }
  .loading span{
    font-size: 1.6em;
  }
</style>
