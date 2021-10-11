<template>
    <div class="otherList">
      <div class="back"><i class="iconfont icon-icon-test1" @click="backs"></i><span>{{actTips}}</span></div>
      <el-divider></el-divider>
      <div class="otherInform" v-if="sheetData">
        <ul class="content">
          <li v-for="(item,index) in sheetData" :key="index" @click="openSheets(actTips,item.id)">
            <p class="img" v-if="item.picUrl"><img v-lazy="item.picUrl" :key="index" alt=""></p>
            <p class="img" v-if="item.coverImgUrl"><img v-lazy="item.coverImgUrl" :key="index" alt=""></p>
            <p class="desc">{{item.name}}</p>
            <p class="playCount"><i class="iconfont icon-bofang1"></i><span>{{item.playCount | playCounts(item.playCount)}}</span></p>
          </li>
        </ul>
      </div>
      <div class="loading" v-loading="isloading"></div>
    </div>
</template>
<script>
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import $ from 'jquery';
  import BScroll from 'better-scroll';
  import axios from 'axios';
    export default {
        props:{
          actTips: String
        },
        data(){
            return{
              sheetData:{},
              isloading:false,
              otherBs: null
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
        methods:{
          ...mapMutations({
            openSheet:'openSheet',
            getSheetSong:'getSheetSong'
          }),
            backs(){
                this.$emit('backSheet',false)
            },
            getSheet(){
                this.isloading = true;
              axios.get(`https://my-wyyapi.vercel.app/top/playlist?cat=${this.actTips}&limit=60&order=hot&realIP=116.25.146.177`)
                .then((res)=>{
                  if(res.data.code == '200') {
                    this.sheetData = res.data.playlists;
                    this.isloading =false;
                    return this.isloading;
                  }
                }).then(res=>{
                    if(!res){
                      this.otherBs = null;
                      this.$nextTick(()=>{
                        if(!this.otherBs){this.otherBs = new BScroll('.otherInform',{scrollY:true,click:true})};
                        console.log(this.otherBs)
                      })
                    }
              })
            },
            openSheets(tip,sheetId){
              this.openSheet(true);
              this.getSheetSong({sheetId:sheetId,sheetList:null}); //creativeId
            },
        },
        updated(){},
        mounted(){},
        created(){
            this.getSheet()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .loading{
    position: fixed;
    top: 50%;
    width: 100%;
  }
  .otherList{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: 10px;
  }
  .back{
    margin: 1.4em;
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
  .otherInform{
    position: absolute;
    overflow: hidden;
    width: 100%;
    top: 10%;
    left: 0;
    height: 100%;
  }
  .otherInform>ul{
    margin-top: 1em;
    list-style-type: none;
    text-align: left;
    padding-bottom: 10em;
  }
  .otherInform>ul>li{
    position: relative;
    display: inline-block;
    margin: .5em;
    width: 30%;
  }
  .otherInform>ul>li p.img img{
    width: 100%;
    height: 100%;
    border-radius: 1.5em;
  }
  .otherInform>ul>li p.desc{
    max-height: 3.0em;
    height: 2.9em;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;      /* 可以显示的行数，超出部分用...表示*/
    -webkit-box-orient: vertical;
    font-size: 1.2em;
  }
  .otherInform>ul>li p.playCount{
    position: absolute;
    right: .6em;
    top: .6em;
    padding: .1em .5em;
    border-radius: 1.5em;
    color: #fff;
    background: rgba(0,0,0,.6);
  }
  .otherInform>ul>li p.playCount i{
    vertical-align: middle;
  }
  .otherInform>ul>li p.playCount span{
    vertical-align: middle;
  }
</style>
