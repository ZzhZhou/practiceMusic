<template>
    <div class="apphome">
      <header class="header">
        <div class="menu"><i class="iconfont icon-NMStubiao-" @click="goLoginMenu"></i></div>
        <div class="center">
          <div class="search" v-if="rName=='MyFound'">
            <p class="tip" @click="openSearch"><i class="iconfont icon-sousuo"></i><span>{{keyWordData.showKeyword}}</span></p>
          </div>
          <div class="myMusic" v-if="rName=='MyMusic'" @click="gologin"><img src="../../assets/images/dec.png" alt=""><span>立即登录</span></div>
        </div>
        <div class="podcast">
          <i class="iconfont icon-yinlemusic214" v-if="rName=='MyFound'"></i>
          <i class="iconfont icon-ziyuan" v-if="rName=='IsPodcast'"></i>
          <i class="iconfont icon-sousuo" v-if="rName=='MyMusic'"></i>
          <i class="iconfont icon-zengjiatianjiajiajian" v-if="rName=='Ksong'"></i>
          <i class="iconfont icon-tubiao-16" v-if="rName=='CloudVillage'"></i>
        </div>
      </header>
      <router-view></router-view>
      <div class="navmmenu" ref="menu" v-if="isShowMenu && isMenu">
        <p v-for="(item,index) in routerName" :key="index" @click="changeColor(index)">
          <router-link  :to="item" ><i :class="routerIcon[index]"></i>{{routerChineseName[index]}}</router-link>
        </p>
      </div>
      <transition name="el-zoom-in-bottom">
        <login-page v-if="islogin" @backhomes="backhome"></login-page>
      </transition>
        <play-list v-if="isPlayPage"></play-list>
      <transition name="el-fade-in-linear">
        <song-sheet v-if="isOpenSheet" class="transition-box"></song-sheet>
      </transition>
      <search-page v-if="isSearch"></search-page>
      <more-sheet v-if="isMoreSheet"></more-sheet>
      <transition name="el-fade-in-linear">
        <login-menu v-if="isLoginMenu" @menuBackHomes="menuBackHome"></login-menu>
      </transition>
      <sheet-desc v-if="isOpenSheetDesc"></sheet-desc>
      <song-detail v-if="isSongDetail"></song-detail>
    </div>
</template>
<script>
  import LoginPage from './loginPage/LoginPage.vue';
  import PlayList from './playListPage/PlayList.vue';
  import SongSheet from './songSheet/SongSheet.vue';
  import SearchPage from './searchPage/SearchPage.vue';
  import MoreSheet from './songSheet/MoreSheet.vue';
  import LoginMenu from './loginPage/LoginMenu.vue';
  import SheetDesc from './songSheet/SheetDesc.vue';
  import SongDetail from '../appComponents/playListPage/SongDetail.vue';
  import axios from 'axios';
  import $ from 'jquery';
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
    export default {
        components:{
          LoginPage,
          PlayList,
          SongSheet,
          SearchPage,
          MoreSheet,
          LoginMenu,
          SheetDesc,
          SongDetail,
        },
        data(){
            return{
              islogin:false,
              content:'',
              banners:{},
              routerName:["MyFound","IsPodcast","MyMusic","Ksong","CloudVillage"],
              routerChineseName:["发现","播客","我的","K歌","云村"],
              routerIcon:["iconfont icon-biaoqianA01_faxian-32",
                "iconfont icon-xinhao1",
                "iconfont icon-yinle",
                "iconfont icon-maikefeng1",
                "iconfont icon-renkou"],
              keyWordData:{},
              isLoginMenu: false,
            }
        },
      computed:{
        ...mapState({
          isPlayPage:'isPlayPage',
          isOpenSheet:'isOpenSheet',
          searchContent:'searchContent',
          rName:'rName',
          isMenu:'isMenu',
          isSearch:'isSearch',
          isMoreSheet:'isMoreSheet',
          isOpenSheetDesc:'isOpenSheetDesc',
          isSongDetail:'isSongDetail'
        }),
        isShowMenu(){
            if(this.isOpenSheet || this.isSearch || this.isMoreSheet){
                this.changeShowMenu(false);
            }else{
              this.changeShowMenu(true);
            }
          return this.isMenu;
        }
      },
      methods:{
        ...mapMutations({
          changeShowMenu: 'changeShowMenu',
          isOpenSearch:'isOpenSearch'
        }),
        gologin(){ // 打开登陆页面
            this.islogin = true;
        },
        goLoginMenu(){
          this.isLoginMenu = true;
        },
        backhome(e){ //接受登录页面返回数据
          this.islogin = e;
        },
        menuBackHome(e){
          this.isLoginMenu = e;
        },
        changeColor(index){ //改变路由颜色
          $('.navmmenu p').eq(index).children().css("color","#dc2c1f")
          $('.navmmenu p').eq(index).siblings().children().css("color","#888")
        },
        openSearch(){
          this.isOpenSearch({searchContent: this.keyWordData.showKeyword,realKeyWord: this.keyWordData.realkeyword,openSearch: true,});
        },
        getRecSong(){
          axios.get('https://my-wyy.vercel.app/search/default?realIP=116.25.146.177').then(res=>{
            if(res.data.code == '200'){
              this.keyWordData = res.data.data
            }
          })
        },
      },
      watch:{
        isMenu(news,old){
            console.log(news)
            if(news){
              this.changeColor(this.routerName.indexOf(this.rName))
            }
        }
      },
      mounted(){
        if(this.rName){ // 判断是否是默认路由改变颜色
          this.changeColor(this.routerName.indexOf(this.rName))
        }
      },
      created(){
          this.getRecSong()
      }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .apphome{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 10px;
  }
  .apphome .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .apphome .header .menu, .apphome .header .podcast{
    margin: 1.2em 1.4em;
  }
  .apphome .header .menu i, .apphome .header .podcast i{
    font-size: 2.5em;
  }
  .apphome .header .center{
    width: 100%;
  }
  .apphome .header .center .search{
    position: relative;
    margin: 0 auto;
    width: 90%;
    height: 2.5em;
    text-align: left;
    border: 1px solid #777;
    border-radius: 1.5em;
    line-height:2.5em;
  }
  .apphome .header .center .search p{
    display: inline-block;
    margin: 0 0 0 1em;
  }
  .apphome .header .center .search p i{
    display: inline-block;
    margin: 0 .3em 0 0;
    vertical-align: middle;
  }
  .apphome .header .center .search .tip{
    position: absolute;
    left: .5em;;
    width: 90%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #aaa;
  }
  .apphome .header .center .myMusic{
    width: 100%;
    text-align: center;
  }
  .apphome .header .center .myMusic img{
    margin:  0 1em;
    width: 3em;
    height: 3em;
    vertical-align: middle;
  }
  .apphome .header .center .myMusic span{
    display: inline-block;
    font-size: 1.5em;
    vertical-align: middle;
  }
  .apphome .navmmenu{
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 6em;
    background: #fff;
    z-index: 3;
  }
  .apphome .navmmenu a{
    width: 8em;
    height: 3em;
    text-decoration:none;
    color: #888;
  }
  .apphome .navmmenu i{
    display: block;
    font-size: 2.5em;
  }
</style>
