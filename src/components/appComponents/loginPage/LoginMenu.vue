<template>
    <div class="loginmenu">
      <div class="close" @click="backs"></div>
      <div class="menu transition-box">
        <div class="uesr">
          <div class="inform">
            <img src="../../../assets/images/dec.png" alt="">
            <span>立即登录</span>
            <i class="iconfont icon-arrow-right"></i>
          </div>
          <div class="saoma">
            <i class="iconfont icon-saoma"></i>
          </div>
        </div>
        <div class="swiper">
          <ul>
            <li class="blackDia">
              <div class="baseInform">
                <div class="content">
                  <p class="bigtitle">续费黑胶VIP</p>
                  <p class="smalltitle">黑胶VIP享超21项专属特权</p>
                </div>
                <div class="centerol">
                  <p>会员中心</p>
                </div>
              </div>
              <el-divider class="line"></el-divider>
              <div class="guanggao">
                <p>受邀专享，黑胶VIP低至0.24元/天！</p>
                <img src="" alt="">
              </div>
            </li>
            <li class="first">
              <div class="youxiang flexBox">
                <p class="p1">
                  <i class="iconfont icon-email-line"></i>
                  <span>我的消息</span>
                </p>
                <p class="p2">
                  <span>18</span>
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <el-divider></el-divider>
              <div class="flexBox cloudbei">
                <p class="p1">
                  <i class="iconfont icon-V"></i>
                  <span>云贝中心</span>
                </p>
                <p class="p2">
                  <span>签到</span>
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <el-divider></el-divider>
              <div class="flexBox creatorCenter">
                <p class="p1">
                  <i class="iconfont icon-diandeng-dengpao-zhaoming"></i>
                  <span>创作者中心</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
            </li>
            <li class="second">
              <div class="title">音乐服务</div>
              <el-divider></el-divider>
              <div class="couldviliage flexBox">
                <p class="p1">
                  <i class="iconfont icon-youhuobaopiaoju"></i>
                  <span>云村有票</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="shop flexBox">
                <p class="p1">
                  <i class="iconfont icon-gouwuche"></i>
                  <span>商城</span>
                </p>
                <p class="p2">
                  <span></span>
                  <img src="" alt="">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="games flexBox">
                <p class="p1">
                  <i class="iconfont icon-youxiji"></i>
                  <span>游戏专区</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="ling flexBox">
                <p class="p1">
                  <i class="iconfont icon-icon--"></i>
                  <span>口袋彩铃</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
            </li>
            <li class="third">
              <div class="title">其他</div>
              <el-divider></el-divider>
              <div class="settings flexBox">
                <p class="p1">
                  <i class="iconfont icon-shezhi"></i>
                  <span>设置</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="onnight flexBox">
                <p class="p1">
                  <i class="iconfont icon-yueduye-yejianmoshi"></i>
                  <span>夜间模式</span>
                </p>
                <p class="p2">
                  <el-switch
                    v-model="isOnNight"
                    style="margin-right: 1em"
                    active-color="red"
                    inactive-color="#ccc">
                  </el-switch>
                </p>
              </div>
              <div class="ontimeclose flexBox">
                <p class="p1">
                  <i class="iconfont icon-time"></i>
                  <span>定时关闭</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="dressup flexBox">
                <p class="p1">
                  <i class="iconfont icon-clothes"></i>
                  <span>个性打扮</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="listendown flexBox">
                <p class="p1">
                  <i class="iconfont icon-tingshu"></i>
                  <span>边听边存</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="online flexBox">
                <p class="p1">
                  <i class="iconfont icon-liuliang"></i>
                  <span>在线听歌免流量</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="blackName flexBox">
                <p class="p1">
                  <i class="iconfont icon-iconset0141"></i>
                  <span>音乐黑名单</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="youngmodel flexBox">
                <p class="p1">
                  <i class="iconfont icon-baohu"></i>
                  <span>青少年模式</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
              <div class="alarmClock flexBox">
                <p class="p1">
                  <i class="iconfont icon-naozhong"></i>
                  <span>音乐闹钟</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div>
            </li>
            <li class="fourth">
              <div class="myOrder flexBox">
                <p class="p1">
                  <i class="iconfont icon-dingdan01"></i>
                  <span>我的订单</span>
                </p>
                <p class="p2">
                  <i class="iconfont icon-arrow-right"></i>
                </p>
              </div><div class="coupon flexBox">
              <p class="p1">
                <i class="iconfont icon-youhuiquan"></i>
                <span>优惠券</span>
              </p>
              <p class="p2">
                <i class="iconfont icon-arrow-right"></i>
              </p>
            </div><div class="myCustom flexBox">
              <p class="p1">
                <i class="iconfont icon-kefu"></i>
                <span>我的客服</span>
              </p>
              <p class="p2">
                <i class="iconfont icon-arrow-right"></i>
              </p>
            </div><div class="share flexBox">
              <p class="p1">
                <i class="iconfont icon-fenxiang1"></i>
                <span>分享网易云音乐</span>
              </p>
              <p class="p2">
                <i class="iconfont icon-arrow-right"></i>
              </p>
            </div><div class="about flexBox">
              <p class="p1">
                <i class="iconfont icon-guanyu"></i>
                <span>关于</span>
              </p>
              <p class="p2">
                <i class="iconfont icon-arrow-right"></i>
              </p>
            </div>
            </li>
            <li class="last">
              <p>退出登录/关闭</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>
  import axios from 'axios';
  import $ from 'jquery';
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import BScroll from 'better-scroll';
    export default {
      data(){
          return{
            isOnNight: false,
            menuBs: null,
          }
      },
      methods:{
          backs(){
              this.$emit('menuBackHomes',false)
          }
      },
      updated(){
        this.$nextTick(()=>{
          this.menuBs = null;
          if(!this.menuBs){this.menuBs = new BScroll('.swiper',{scrollY:true,click:true})};
          console.log(this.menuBs)
        })
      },
      mounted(){
        this.$nextTick(()=>{
          this.menuBs = null;
          if(!this.menuBs){this.menuBs = new BScroll('.swiper',{scrollY:true,click:true,bounce:false})};
          console.log(this.menuBs)
        })
      }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .loginmenu{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    font-size: 10px;
  }
  .loginmenu .close{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.6);
    z-index: 5;
  }
  .loginmenu .menu{
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    height: 100%;
    background: #fff;
    z-index: 6;
  }
  .loginmenu .menu .uesr{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2em 1em;
  }
  .loginmenu .menu .uesr .inform>img{
    width: 3em;
    height: 3em;
    vertical-align: middle;
  }
  .loginmenu .menu .uesr .inform>span{
    display: inline-block;
    margin: 0 .5em;
    font-size: 1.5em;
    vertical-align: middle;
  }
  .loginmenu .menu .uesr .inform>i{
    font-size: 1.5em;
    vertical-align: middle;
  }
  .loginmenu .menu .saoma>i{
    font-size: 1.8em;
  }
  .swiper{
    overflow: hidden;
    height: 100%;
  }
  .swiper ul{
    list-style-type: none;
    background: #eee;
    padding-bottom: 8em;
  }
  .blackDia{
    background: rgba(0,0,0,.5);
    margin: 0 1em;
    border-radius: 1.5em;
    color: #fff;
  }
  .blackDia .baseInform{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .blackDia .baseInform .content{
    text-align: left;
    margin:  1em 1.5em;
  }
  .blackDia .baseInform .content .bigtitle{
    margin-bottom: .5em;
    font-size: 1.6em;
  }
  .blackDia .baseInform .content .smalltitle{
    color: #bbb;
  }
  .blackDia .baseInform .centerol p{
    margin: 1em 1.5em;
    padding: .2em 1em;
    border: 1px solid #ccc;
    border-radius: 1.5em;
    color: #ccc;
  }
  .line{
    width: 90%;
    margin: 0 auto;
  }
  .guanggao{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .guanggao p{
    color: #ccc;
    margin: 1em 1.5em;
  }
  .first, .second, .third, .fourth, .last{
    margin: 1.5em;
    border-radius: 1.5em;
    background: #fff;
  }
  .flexBox{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 1.5em 0 ;
    border-radius: 1.5em;
  }
  .flexBox .p1>span{
    font-size: 1.4em;
  }
  .flexBox .p1>i{
    margin: 0 10px;
    font-size: 1.6em;
  }
  .flexBox .p2>i{
    margin: 0 10px;
    font-size: 1.6em ;
    color: #ccc;
  }
  .title{
    padding: 1em;
    text-align: left;
    color: #aaa;
    font-size: 1.2em;
  }
  .last p{
    padding: 1.5em 0;
    text-align: center;
    color: red;
    font-size: 1.6em;
  }
</style>
