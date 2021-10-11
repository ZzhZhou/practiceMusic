<template>
    <div class="login">
      <div class="logoico">
        <img src="../../../assets/images/ic_launcher.png" alt="">
      </div>
      <div class="funcbtn">
        <div class="phonelogin"><button @click="gohome">手机号登录</button></div>
        <div class="visiter"><button @click="gohome">立即体验</button></div>
        <div class="otherlogin">
          <img src="../../../assets/images/duc.png" alt="">
          <img src="../../../assets/images/c6z.png" alt="">
          <img src="../../../assets/images/dua.png" alt="">
          <img src="../../../assets/images/du7.png" alt="">
        </div>
        <div class="explain">
          <span class="span1">登录即已同意</span>
          <span class="span2">《用户协议》《隐私政策》《儿童隐私政策》</span>
        </div>
      </div>
    </div>
</template>
<script>
    export default {
        methods:{
            gohome(){
              this.$emit("backhomes", false)
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .login{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #dc2c1f;
    font-size: 10px;
    z-index: 5;
  }
  .login .logoico{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
  }
  .login .logoico img{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8em;
    height: 8em;
    margin-left: -4em;
    margin-top: -4em;
    border-radius: 50%;
  }
  .login .funcbtn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
  }
  .login .funcbtn .phonelogin{
    margin: 2em 0;
  }
  .login .funcbtn .phonelogin button{
    width: 19em;
    height: 3em;
    border: 1px solid #ccc;
    border-radius: 1.5em;
    color: #dc2c1f;
    background: #fff;
  }
  .login .funcbtn .visiter button{
    width: 19em;
    height: 3em;
    border: 1px solid #fff;
    opacity: .7;
    border-radius: 1.5em;
    color: #fff;
    background: #dc2c1f;
  }
  .login .funcbtn .otherlogin img{
    margin: 2.5em 1.5em;
    width: 4em;
    height: 4em;
  }
  .login .funcbtn .explain{
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
  }
  .login .funcbtn .explain .span1{
    display: inline-block;
    color: #999;
    opacity: .6;
  }
  .login .funcbtn .explain .span2{
    display: inline-block;
    font-weight: 100;
    color: #ccc;
  }
</style>
