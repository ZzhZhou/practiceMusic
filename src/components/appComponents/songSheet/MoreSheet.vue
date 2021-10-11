<template>
    <div class="moresheet">
      <div class="back"><i class="iconfont icon-icon-test1" @click="goBack"></i><span>歌单广场</span></div>
      <div class="sheettip">
       <div class="sometip">
         <ul>
           <li v-for="(item,index) in sheetTip" :key="index" @click="getSheetTip(item,index)" :ref="`item${index}`">
             <span class="tipName">{{item}}</span>
             <span class="bottomline" :ref="`line${index}`"></span>
           </li>
         </ul>
       </div>
        <div class="tipmenu"><i class="iconfont icon-caidan1" @click="openSheetType"></i></div>
      </div>
      <div class="sheetSwiper">
        <div class="allsheet"  v-if="!isSheetLoading">
          <div class="sheettitle" v-if="activeTip == '推荐'">
            <h2><i class="iconfont icon-icon_refresh"></i><span>热门歌单</span></h2>
          </div>
          <div class="sheettitle" v-if="activeTip == '精品'">
            <h2><span class="plus">全部精品</span></h2>
            <p @click="openBoutique"><i class="iconfont icon-shaixuan"></i><span>筛选</span></p>
          </div>
          <div class="sheetInform" v-if="sheetData.length == 0?false:true">
            <ul>
              <li v-for="(item,index) in sheetData" :key="index" @click="openSheets(activeTip,item.id)">
                <p class="img" v-if="item.picUrl"><img v-lazy="item.picUrl" :key="index" alt=""></p>
                <p class="img" v-if="item.coverImgUrl"><img v-lazy="item.coverImgUrl" :key="index" alt=""></p>
                <p class="desc">{{item.name}}</p>
                <p class="playCount"><i class="iconfont icon-bofang1"></i><span>{{item.playCount | playCounts(item.playCount)}}</span></p>
              </li>
            </ul>
          </div>
          <div class="sheetloading" v-if="sheetData.length == 0?true:false">暂无更多歌单</div>
        </div>
        <div class="sheetloading"  v-loading="isSheetLoading"></div>
      </div>
      <AllSheetType v-if="isAllSheetType"
                    :sheetTips="sheetTip"
                    :getSheetTips="getSheetTip"
                    @cloSheetType="cloSheetTypes"></AllSheetType>
      <boutique-type v-if="isBoutique" @backMore="backMores"></boutique-type>
    </div>
</template>
<script>
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import $ from 'jquery';
  import BScroll from 'better-scroll';
  import axios from 'axios';
  import AllSheetType from './AllSheetType.vue';
  import BoutiqueType from './BoutiqueType.vue';
    export default {
        data(){
            return{
              sheetTip:['推荐','官方','视频歌单','精品','华语','ACG','电子','流行','古风'],
              tBs: null,
              sheetBs:null,
              activeTip: '推荐',
              sheetData:[],
              isSheetLoading: false,
              isAllSheetType: false,
              isBoutique: false,
            }
        },
        components:{
          AllSheetType,
          BoutiqueType,
        },
        computed:{
          ...mapState({
            sheetActiveTip:'sheetActiveTip'
          }),
        },
        methods:{
            ...mapMutations({
              openMoreSheet:'openMoreSheet',
              openSheet:'openSheet',
              getSheetSong:'getSheetSong'
            }),
            getSheetTip(tip,index,niceTip='全部'){
                this.sheetBs = null;
                this.isSheetLoading = true;
                this.sheetData = [];
                let url = '';
                this.activeTip = tip;
                this.switchBtn(index)
                if(this.activeTip == '推荐'){
                  url = '/personalized?limit=60&realIP=116.25.146.177';
                }else if(this.activeTip == '精品'){
                    if(niceTip == '全部'){
                      sessionStorage.setItem('checkTip',0)
                    }
                  url = `/top/playlist/highquality?cat=${niceTip}&limit=60&order=hot&realIP=116.25.146.177`
                }else{
                  url = `/top/playlist?cat=${this.activeTip}&limit=60&order=hot&realIP=116.25.146.177`;
                }
                new Promise((resolve,reject)=>{
                  axios.get(`https://my-wyyapi.vercel.app${url}`)
                    .then((res)=>{
                      if(res.data.code == '200'){
                        if(this.activeTip == '推荐'){
                          this.sheetData = res.data.result;
                        }else{
                          this.sheetData = res.data.playlists;
                        }
                        this.isSheetLoading = false;
                        if(!this.isSheetLoading){
                          resolve(true);
                        }
                      }
                    })
                }).then(res=>{
                    if(res){
                      this.$nextTick(()=>{
                        if(!this.sheetBs){this.sheetBs = new BScroll('.sheetSwiper',{scrollY:true,click:true})};
                      })
                    }
                })

            },
            switchBtn(index){
                this.$nextTick(()=>{
                  $('.sometip>ul>li').eq(index).children('.bottomline').css('display','block');
                  $('.sometip>ul>li').eq(index).siblings().children('.bottomline').css('display','none');
                })
            },
            goBack(){
                this.openMoreSheet(false)
            },
            openSheets(tip,sheetId){
              this.openSheet(true);
              this.getSheetSong({sheetId:sheetId,sheetList:null}); //creativeId
            },
            cloSheetTypes(e){
              this.isAllSheetType = e.isClose;
              this.getSheetTip(e.tip,e.tipIndex);
            },
            openSheetType(){
              this.isAllSheetType = true;
            },
          openBoutique(){
                this.isBoutique = true;
          },
          backMores(e){
            this.isBoutique = e.isClose;
            if(e.tipName){
              this.getSheetTip('精品',this.sheetTip.indexOf('精品'),e.tipName)
            }
          }
        },
      filters: {
        playCounts(playCount){
          if (!playCount) {
            return 0;
          }
          if ((playCount < 100000000) && (playCount >= 10000)) {
            if ((playCount < 100000) && (playCount >= 10000)) {
              return (playCount / 10000).toFixed(1) + "万"
            }
            else {
              return Math.floor((playCount / 10000)) + "万"
            }
          }
          else if (playCount >= 100000000) {
            return Math.floor((playCount / 100000000)) + "亿"
          }
          else if (playCount < 10000) {
            return playCount
          }
        },
      },
        updated(){
            this.$nextTick(()=>{
              if(!this.tBs){this.tBs = new BScroll('.sometip',{scrollX:true,click:true})}else{this.tBs.refresh()};
            })
        },
        mounted(){
          this.$nextTick(()=>{
            if(!this.tBs){this.tBs = new BScroll('.sometip',{scrollX:true,click:true})}else{this.tBs.refresh()};
            this.switchBtn(this.sheetTip.indexOf(this.activeTip));
          })
        },
        created(){
            this.activeTip = this.sheetActiveTip;
            this.getSheetTip(this.activeTip)
        },
      beforeDestroy() {

      }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .clearfix:after{
    content: '';
    display: block;
    clear: both;
    overflow: hidden;
  }
  .moresheet{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: 10px;
  }
  .back{
    margin: 1em 1.4em;
    text-align: left;
  }
  .back i, .back span{
    vertical-align: middle;
    font-size: 1.8em;
  }
  .back span{
    display: inline-block;
    margin: 0 1em;
    font-size: 1.6em;
    font-weight: 600;
  }
  .sheettip{
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
  .sheettip .sometip{
    flex: 0 0 90%;
    overflow : hidden;
    white-space: nowrap;
  }
  .sheettip .sometip>ul{
    margin: 1em 0;
    list-style-type: none;
    text-align: left;
    width: 50em;
  }
  .sheettip .sometip>ul>li{
    position: relative;
    left: 0;
    margin-left: 1.4em;
    display: inline-block;
    text-align: center;
    font-size: 1.4em;
  }
  .sheettip .sometip>ul>li span.tipName{
   vertical-align: middle;
  }
  .sheettip .sometip>ul>li span.bottomline{
    position: absolute;
    left: 0;
    bottom: .1em;
    display: none;
    width: 100%;
    height: 0.4em;
    background: rgba(220,44,31,.6);
    border-radius: 1em;
  }
  .sheettip .tipmenu{
    flex: 0 0 10%;
  }
  .sheettip .tipmenu i{
    font-size: 1.6em;
    vertical-align: middle;
  }
  .sheetSwiper{
    overflow: hidden;
    height: 100%;
  }
  .allsheet{
    margin: 0 1.4em;
    text-align: left;
    padding-bottom: 12em;
  }
  .sheetloading{
    position: fixed;
    top: 40%;
    width: 100%;
    text-align: center;
  }
  .allsheet .sheettitle{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .allsheet .sheettitle i{
    margin-right: .5em;
    vertical-align: middle;
    font-size: 1em;
  }
  .allsheet .sheettitle span{
    vertical-align: middle;
    font-size: 1.1em;
  }
  .allsheet .sheettitle p{
    height: 1.4em;
    line-height: 1.4em;
    text-align: left;
  }
  .allsheet .sheettitle p i{
    font-size: 1.4em;
    vertical-align: middle;
  }
  .allsheet .sheettitle p span{
    display: inline-block;
    font-size: 1.4em;
    vertical-align: middle;
    font-weight: 600;
  }
  .sheetInform{
    overflow: hidden;
  }
   .sheetInform>ul{
    margin-top: 1em;
    list-style-type: none;
    text-align: left;
  }
   .sheetInform>ul>li{
     position: relative;
    display: inline-block;
    margin: .5em;
    width: 30%;
  }
  .sheetInform>ul>li p.img img{
    width: 100%;
    height: 100%;
    border-radius: 1.5em;
  }
  .sheetInform>ul>li p.desc{
    max-height: 3.0em;
    height: 2.9em;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;      /* 可以显示的行数，超出部分用...表示*/
    -webkit-box-orient: vertical;
    font-size: 1.2em;
  }
  .sheetInform>ul>li p.playCount{
    position: absolute;
    right: .6em;
    top: .6em;
    padding: .1em .5em;
    border-radius: 1.5em;
    color: #fff;
    background: rgba(0,0,0,.6);
  }
  .sheetInform>ul>li p.playCount i{
    vertical-align: middle;
  }
  .sheetInform>ul>li p.playCount span{
    vertical-align: middle;
  }
</style>
