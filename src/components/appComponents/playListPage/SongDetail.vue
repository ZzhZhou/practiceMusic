<template>
    <div class="songdetail">
      <div class="closeDetail" @click="isOpenSongDetail({isOpen: false,detail:{}})"></div>
      <div class="allSongDetail">
        <div class="songInform" v-if="!objIsNull(songDetail.album)">
          <div class="img"><img v-lazy="songDetail.al.picUrl" alt=""></div>
          <div class="songName">
            <p class="p1"><span class="sp1">歌曲：{{songDetail.name}}</span></p>
            <p class="p2">{{songDetail.ar[0].name}}</p>
          </div>
        </div>
        <div class="songInform" v-if="objIsNull(songDetail.album)">
          <div class="img"><img v-lazy="songDetail.artists[0].img1v1Url" alt=""></div>
          <div class="songName">
            <p class="p1"><span class="sp1">歌曲：{{songDetail.name}}</span></p>
            <p class="p2">{{songDetail.artists[0].name}}</p>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="detailSwiper">
          <ul>
            <li @click="nextSong"><i class="iconfont icon-bofang4"></i><span>下一首播放</span></li>
            <li><i class="iconfont icon-tianjiashoucang"></i><span>收藏到歌单</span></li>
            <li><i class="iconfont icon-xiazai"></i><span>下载</span></li>
            <li><i class="iconfont icon-pinglun2"></i><span>评论</span></li>
            <li><i class="iconfont icon-fenxiang"></i><span>分享</span></li>
            <li v-if="!objIsNull(songDetail.album)"><i class="iconfont icon-gerenzhongxin"></i><span>歌手：{{songDetail.ar[0].name}}</span></li>
            <li v-if="objIsNull(songDetail.album)"><i class="iconfont icon-gerenzhongxin"></i><span>歌手：{{songDetail.artists[0].name}}</span></li>
            <li><i class="iconfont icon-zhuanji"></i><span>专辑</span></li>
            <li><i class="iconfont icon-V"></i><span>云贝推歌</span></li>
            <li><i class="iconfont icon-shipin"></i><span>相关视频</span></li>
            <li><i class="iconfont icon-lingdang"></i><span>设为铃声</span></li>
            <li><i class="iconfont icon-shoucangxinyuandanyuanwangqingdantuijian"></i><span>音乐礼品卡</span></li>
            <li><i class="iconfont icon-no"></i><span>屏蔽歌曲或歌手</span></li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import $ from 'jquery';
  import BScroll from 'better-scroll'
  import axios from 'axios'
    export default {
      data(){
        return{
          detailBs: null,
        }
      },
      computed:{
        ...mapState({
          songDetail:'songDetail',
          commentData:'commentData',
          playIndex:'playIndex',
          playList:'playList',
          isPlayList:'isPlayList'
        }),
        objIsNull(){ // 判断数据对象或数组是否为空
          return (obj)=>{
            if(obj instanceof Array){
              if(obj.length === 0){
                return false;
              }else{
                return true;
              }
            }else{
              for(let k in obj){
                if(obj.hasOwnProperty(k)){
                  return true;
                }
              }
              return false;
            }
          }
        },
      },
      methods:{
        ...mapMutations({
          resolveComment:'resolveComment',
          isOpenSongDetail:'isOpenSongDetail',
          changeNextSong:'changeNextSong',
          changePlayList:'changePlayList',
          changeIndex:'changeIndex',
          openCloseList:'openCloseList'
        }),
        nextSong(){
            let count = 0;
            let songs = {};
            if(!this.objIsNull(this.songDetail.album)){
              songs = {
                duration:this.songDetail.dt,
                imageUrl:this.songDetail.al.picUrl,
                arName:this.songDetail.ar,
                songName:this.songDetail.name,
                songMinName:this.songDetail.al.name,
                resourceId:this.songDetail.id,
                fee:this.songDetail.fee,
                mv: this.songDetail.mv,};
            }
            if(this.objIsNull(this.songDetail.album)){
              songs = {
                duration: this.songDetail.duration,
                imageUrl: this.songDetail.artists[0].img1v1Url,
                arName: this.songDetail.artists,
                songName:this.songDetail.name,
                songMinName: this.songDetail.album.name,
                resourceId:this.songDetail.id,
                fee:this.songDetail.fee,
                mv:  this.songDetail.mvid,};
            }
            try{
                if(this.playList.length === 0){
                  this.changeNextSong({index: 0,song: songs})
                  this.changeIndex(0);
                  this.openCloseList({isPage:true,isList: !this.isPlayList})
                }else{
                  this.playList.find((ele,index)=>{
                    if(ele.resourceId == this.songDetail.id){
                      count = index
                      throw Error();
                    }else{
                      if(index >= this.playList.length-1){
                        this.changeNextSong({index: this.playIndex+1,song: songs})
                      }
                    }
                  })
                }
            }catch (e){
              if(this.playIndex !== count){
                if(count == this.playIndex+1){
                  this.$message({
                    message: '歌曲已就绪',
                    type: 'warning',
                    offset: 0,
                  });
                  this.isOpenSongDetail(false);
                  return;
                }
                this.changePlayList(count)
                if(this.playIndex > count){
                    console.log(this.playIndex)
                  this.changeNextSong({index: this.playIndex,song: songs})
                  this.changeIndex(this.playIndex-1);
                }
                if(this.playIndex < count){
                  this.changeNextSong({index: this.playIndex+1,song: songs})
                }
              }else{
              this.$message({
                message: '歌曲正在播放',
                type: 'warning',
                offset: 0,
              });
              }
            }
            this.isOpenSongDetail(false);
        }
      },
      updated(){},
      mounted(){
        this.$nextTick(()=>{
          this.detailBs = null;
          if(!this.detailBs){
            this.detailBs = new BScroll('.detailSwiper',{scrollY:true,click:true})
//            console.log(this.detailBs)
          }
        })
      },
      created(){
//          console.log(this.songDetail)
      },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    padding: 0;
    margin: 0;
  }
  .songdetail{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
  }
  .songdetail .closeDetail{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.6);
    z-index: 4;
  }
  .songdetail .allSongDetail{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 65%;
    background: #fff;
    z-index: 5;
    border-top-left-radius: 1.8em;
    border-top-right-radius: 1.8em;
  }
  .songdetail .allSongDetail .songInform{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .songdetail .allSongDetail .songInform .img{
   flex: 0 0 18%;
    margin: 1em;
  }
  .songdetail .allSongDetail .songInform .img>img{
    width: 6em;
    height: 6em;
    border-radius: .5em;
  }
  .songdetail .allSongDetail .songInform .songName{
    flex: 0 0 82%;
    text-align: left;
  }
  .songdetail .allSongDetail .songInform .songName .p1{
    margin-bottom: .5em;
    width: 90%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .songdetail .allSongDetail .songInform .songName .p1 span.sp1{
    font-size: 1.5em;
    color: black;
  }
  .songdetail .allSongDetail .songInform .songName .p2{
    color: #999;
  }
  .detailSwiper{
    margin: 1em 0;
    overflow: hidden;
    height: 100%;
  }
  .detailSwiper>ul{
    margin: 1em;
    list-style-type: none;
    text-align: left;
    padding-bottom: 8em;
  }
  .detailSwiper>ul>li{
    margin: 2em 0;
  }
  .detailSwiper>ul>li>i{
    margin: 0 10px;
    font-size: 2em;
    vertical-align: middle;
  }
  .detailSwiper>ul>li>span{
    display: inline-block;
    margin: 0 10px;
    font-size: 1.4em;
    vertical-align: middle;
  }
</style>
