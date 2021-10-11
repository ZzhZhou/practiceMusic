<template>
    <div class="songsheet" v-if="objIsNull(songSheet)">
      <ul class="content">
        <li class="topview clearfix">
          <div class="sheetdetail" v-if="loading">
            <div class="left"><img v-lazy="songSheet.coverImgUrl" alt="" @click="isCloseDesc"></div>
            <div class="right">
              <p class="sheetname">{{songSheet.name}}</p>
              <p class="sheetcreater"><img v-lazy="songSheet.creator.avatarUrl" alt=""><span>{{songSheet.creator.nickname}}</span><i class="iconfont icon-tianjia2"></i></p>
              <p class="sheetdesc"><span>{{songSheet.description}}</span><i class="iconfont icon-arrow-right" @click="isCloseDesc"></i></p>
            </div>
          </div>
           <div class="btnfn" v-if="loading">
             <i class="iconfont icon-tianjiashoucang"></i><span>{{songSheet.subscribedCount | playCounts(songSheet.subscribedCount)}}</span>
             <i class="iconfont icon-vertical_line"></i>
             <i class="iconfont icon-pinglun2"></i><span>{{songSheet.commentCount | playCounts(songSheet.commentCount)}}</span>
             <i class="iconfont icon-vertical_line"></i>
             <i class="iconfont icon-fenxiang"></i><span>{{songSheet.shareCount | playCounts(songSheet.shareCount)}}</span>
           </div>
        </li>
          <li class="sheetcontent" v-if="loading">
            <div class="songlist">
              <ul class="content">
                <li class="playbtn">
                  <p class="p1"><i class="iconfont icon-bofang2" style="color: red" @click="playSng(0)"></i></p>
                  <p class="p2"><span class="sp11" @click="playSng(0)">播放全部</span><span class="sp22">({{songSheet.trackCount | playCounts(songSheet.trackCount)}})</span></p>
                  <p class="p3"><i class="iconfont icon-xiazai"></i><i class="iconfont icon-gouxuan"></i></p>
                </li>
                <li v-for="(item ,index) in sheetDetail" :key="index">
                  <p class="p1"><span v-if="(item.id == songId?false:true)">{{index+1}}</span><i class="iconfont icon-ziyuanldpi" v-if="(item.id == songId?true:false)" style="color: red"></i></p>
                  <p class="p2">
                    <span class="sp1" @click="playSng(index)">{{item.name}}</span>
                    <span class="sp2" @click="playSng(index)"><i class="iconfont icon-VIP" v-if="sheetList[index].fee == 1 ? true : false" style="color: red;"></i><span>{{item.ar[0].name}}-{{item.al.name}}</span></span>
                  </p>
                  <p class="p3"><i class="iconfont icon-shipin"></i><i class="iconfont icon-yuandiancaidan" @click="getSongDesc(item)"></i></p>
                </li>
              </ul>
            </div>
          </li>
        <li class="loading" v-loading="!loading"></li>
      </ul>
      <div class="nav2">
        <p class="p1"><i class="iconfont icon-icon-test1" @click="openSheet(false)"></i><span>歌单</span></p>
        <p class="p2"><i class="iconfont icon-sousuo"></i><i class="iconfont icon-youcecaidan"></i></p>
      </div>
      <div class="nav3" v-if="isShowPlayBtn">
        <p class="p1"><i class="iconfont icon-bofang2" style="color: red" @click="playSng(0)"></i></p>
        <p class="p2"><span class="sp11" @click="playSng(0)">播放全部</span><span class="sp22">({{songSheet.trackCount | playCounts(songSheet.trackCount)}})</span></p>
        <p class="p3"><i class="iconfont icon-xiazai"></i><i class="iconfont icon-gouxuan"></i></p>
      </div>
    </div>
</template>
<script>
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import $ from 'jquery';
  import BScroll from 'better-scroll';
  import axios from 'axios';
    export default {
      data(){
          return{
            sheetsong:[],
            sheetDetail:{},
            loading:true,
            sheetBs:null,
            scrollY:0,
            isShowPlayBtn:false,
            maxScrollY:0,
            count:0
          }
      },
      computed:{
        ...mapState({
          isOpenSheet:'isOpenSheet',
          songSheet:'songSheet',
          sheetList:'sheetList',
          sheetId:'sheetId',
          isPlayList:'isPlayList',
          isPlayPage:'isPlayPage',
          playIndex:'playIndex',
          songId:'songId',
        }),
        objIsNull(){ // 判断数据对象或数组是否为空
          return (obj)=>{
            if(obj instanceof Array){
              if(obj.length == 0){
                return false;
              }else{
                return true;
              }
            }else{
              for(let k in obj){
                if(k !== 0){
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
          openSheet:'openSheet',
          getSongSheetData:'getSongSheetData',
          getSheetSong:'getSheetSong',
          getPlayList:'getPlayList',
          openCloseList:'openCloseList',
          changeSheetDesc:'changeSheetDesc',
          resolveComment:'resolveComment',
          isOpenSongDetail:'isOpenSongDetail',
        }),
          getSheet(){
            this.loading = false;
            new Promise((resolve,reject)=>{
              axios.get(`https://my-wyy.vercel.app/playlist/detail?id=${this.sheetId}&realIP=116.25.146.177`,{withCredentials: true}).then(res=>{
                if(res.data.code == '200'){
                  let list = [];
                  sessionStorage.setItem('sheetList',JSON.stringify(res.data.playlist));
                  this.getSongSheetData(JSON.parse(sessionStorage.getItem('sheetList')));
                  JSON.parse(sessionStorage.getItem('sheetList')).trackIds.forEach(ele=>{
                    list.push(ele.id)
                  })
                  resolve(list.join())
                }
              }).catch((res)=>{
                  console.log('网络错误');
                  let timer = null;
                  let count = 0;
//                  timer = setInterval(()=>{
//                      count++;
//                      if(count >= 15 && this.isOpenSheet){
//                          this.getSheet()
//                          count = 0;
//                          clearInterval(timer);
//                          timer = null;
//                      }
//                  },1000)
              })
            }).then(res=>{
                if(res){
                    axios.get(`https://my-wyy.vercel.app/song/detail?ids=${res}&realIP=116.25.146.177`).then(res=>{
                        if(res.data.code == '200'){
                          sessionStorage.setItem('allSongs',JSON.stringify(res.data.songs));
                          this.sheetDetail = JSON.parse(sessionStorage.getItem('allSongs'));
                          this.getSheetSong({sheetId:this.sheetId,sheetList: this.getSheetSongs()});
                          this.loading = true;
                        }
                    })
                }
            })
        },
          playSng(index){
            this.getPlayList({playlist: this.getSheetSongs(),song:this.sheetList[index],playIndex:index})
            this.openCloseList({isPage:true,isList: !this.isPlayList});
          },
          getSheetSongs(){
            this.sheetsong = [];
            let list = [];
            JSON.parse(sessionStorage.getItem('allSongs')).forEach(ele=>{
              list.push(ele.id)
              this.sheetsong.push({
                duration:ele.dt,
                imageUrl:ele.al.picUrl,
                arName:ele.ar,
                songName:ele.name,
                songMinName:ele.al.name,
                resourceId:ele.id,
                fee:ele.fee,
                mv: ele.mv,
              })
            })
            return this.sheetsong
          },
          isCloseDesc(){
              this.changeSheetDesc(true);
          },
          getSongDesc(item){
              console.log(item)
            this.isOpenSongDetail({isOpen: true,detail: item});
          }
      },
      watch:{
        scrollY(news,old){
            if(Math.floor(news) <=(-220)){
                this.isShowPlayBtn = true;
            }else{
              this.isShowPlayBtn = false;
            }
          this.$forceUpdate()
        }
      },
      filters:{
        playCounts(playCount){
          if(!playCount){ return 0;}
          if((playCount < 100000000)&&(playCount >= 10000)){
            if((playCount < 100000)&&(playCount >= 10000)){
              return (playCount/10000).toFixed(1)+"万"
            }
            else{
              return Math.floor((playCount/10000))+"万"
            }
          }
          else if(playCount >= 100000000){
            return Math.floor((playCount/100000000))+ "亿"
          }
          else if(playCount < 10000){
            return playCount
          }
        },
      },
      updated(){
        if(this.loading){
          this.$nextTick(()=>{
            if(!this.sheetBs){
              this.sheetBs = new BScroll('.songsheet',{scrollY:true,momentum: true,click:true,bounce:false,probeType:3});
            }else{
              this.sheetBs.refresh()
            }
//          this.sheetBs.scrollToElement(this.$refs[`playing${this.playIndex}`][0],0,0);//打开滚动到播放歌曲
            this.sheetBs.on('scroll',(e)=>{
              this.scrollY = e.y;
            })
          })
        }
      },
      mounted(){
//        if(this.loading){
//          this.$nextTick(()=>{
//              if(!this.sheetBs){
//                  this.sheetBs = new BScroll('.songsheet',{scrollY:true,click:true,bounce:true,probeType:2});
//              }else{
//                  this.sheetBs.refresh()
//              }
////          this.sheetBs.scrollToElement(this.$refs[`playing${this.playIndex}`][0],0,0);//打开滚动到播放歌曲
//            this.sheetBs.on('scroll',(e)=>{
//              if(e.y<(-220)){
//                this.isShowPlayBtn = true;
//              }else{
//                  this.isShowPlayBtn =false;
//              }
//            })
//          })
//        }
      },
      created(){
          this.loading = false;
          if(JSON.parse(sessionStorage.getItem('allSongs')) && this.sheetId === this.songSheet.id){
            this.sheetsong = [];
            this.sheetDetail = JSON.parse(sessionStorage.getItem('allSongs'));
            this.getSheetSong({sheetId:this.sheetId,sheetList: this.getSheetSongs()});
            this.getSongSheetData(JSON.parse(sessionStorage.getItem('sheetList')));
            this.loading = true;
          }else{
                this.getSheet()
          }
      },
      beforeDestroy() {}
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
  .songsheet{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 2;
    font-size: 10px;
    overflow: hidden;
  }
  .songsheet .nav2{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 2em 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #00a8df;
    z-index: 4;
  }
  .songsheet .nav2 p.p1{
    padding: 0 1em;
  }
  .songsheet .nav2 p.p1 i{
    font-size: 1.8em;
    color: #fff;
  }
  .songsheet .nav2 p.p1 span{
    display: inline-block;
    margin-left: 1em;
    font-size: 1.8em;
    color: #fff;
  }
  .songsheet .nav2 p.p2{
    padding: 0 1em;
  }
  .songsheet .nav2 p.p2 i{
    font-size: 1.8em;
    color: #fff;
  }
  .songsheet .nav2 p.p2 i.icon-sousuo{
    margin: 1em;
  }
  .songsheet .nav3{
    position: fixed;
    top: 6.4em;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    background: #fff;
    z-index: 4;
  }
  .songsheet .nav3>p.p1{
    margin: 1em;
    flex: 0 0 3em;
    width: 3em;
    height: 3em;
    text-align: center;
    line-height: 3em;
  }
  .songsheet .nav3>p.p1 span{
    font-size: 1.6em;
  }
  .songsheet .nav3>p.p1 i{
    font-size: 2em;
  }
  .songsheet .nav3>p.p2{
    flex: 1 0 auto;
    width: 40%;
  }
  .songsheet .nav3>p.p2 span.sp11{
    display: inline-block;
    vertical-align: middle;
    font-size: 1.6em;
    line-height: 1.6em;
  }
  .songsheet .nav3>p.p2 span.sp22{
    display: inline-block;
    color: #999;
    font-size: 1.2em;
    margin-left: .5em;
    vertical-align: middle;
    line-height: 1.6em;
  }
  .songsheet .nav3>p.p3{
    flex: 0 0 6em;
    text-align: center;

  }
  .songsheet .nav3>p.p3 i{
    color: #bbb;
  }
  .songsheet .nav3>p.p3 i.icon-yuandiancaidan, .songsheet .nav3>p.p3 i.icon-gouxuan{
    margin: 1em;
    font-size: 2em;
  }
  .songsheet>ul{
    padding-bottom: 10em;
  }
  .songsheet .topview{
    position: relative;
    width: 100%;
    height: 40%;
    background: #00a8df;
  }
  .loading{
    position: fixed;
    top: 50%;
    width: 100%;
  }
  .songsheet .topview .btnfn{
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 28em;
    height: 4em;
    margin-left: -14em;
    margin-bottom: -2em;
    border-radius: 2em;
    background: #fff;
    border: 1px solid #ddd;
    line-height: 4em;
  }
  .songsheet .topview .btnfn i{
    color: #aaa;
    font-size: 1.4em;
  }
  .songsheet .topview .btnfn i.icon-vertical_line{
    margin: 0 .5em;
    font-size: 1.8em;
  }
  .songsheet .topview .btnfn span{
    margin: 0 .5em;
    color: #aaa;
    font-size: 1.4em;
  }
  .songsheet .sheetdetail{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1em;
    padding-top: 6.4em;
    padding-bottom: 3.5em;
  }
  .songsheet .sheetdetail .left{
    width: 35%;
    height: 35%;
  }
  .songsheet .sheetdetail .left img{
    width: 100%;
    height: 100%;
    border-radius: 1.5em;
  }
  .songsheet .sheetdetail .right{
    margin-left: 1em;
    text-align: left;
    height: 12em;
    width: 60%;
  }
  .songsheet .sheetdetail .right p{
    width: 100%;
  }
  .songsheet .sheetdetail .right p.sheetname{
    font-size: 1.6em;
    color: #fff;
  }
  .songsheet .sheetdetail .right p.sheetcreater{
    margin: 1em 0;
  }
  .songsheet .sheetdetail .right p.sheetcreater img{
    width: 3em;
    height: 3em;
    border-radius: 50%;
    vertical-align: middle;
  }
  .songsheet .sheetdetail .right p.sheetcreater span{
    display: inline-block;
    margin-left: 1em;
    color: #eee;
    vertical-align: middle;
  }
  .songsheet .sheetdetail .right p.sheetcreater i{
    color: #ddd;
    font-size: 1.6em;
    vertical-align: middle;
    margin-left: .2em;
  }
  .songsheet .sheetdetail .right p.sheetdesc>span{
    display: inline-block;
    width: 80%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.2em;
    vertical-align: middle;
    color: #eee;
  }
  .songsheet .sheetdetail .right p.sheetdesc>i{
    vertical-align: middle;
    color: #eee;
  }
  .songsheet .sheetcontent{
    margin-top: 2.5em;
  }
  .songsheet .sheetcontent .songlist{
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
  }
  .songsheet .sheetcontent .songlist>ul.content{
    list-style-type: none;
  }
  .songsheet .sheetcontent .songlist>ul.content li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p1{
    margin: 1em;
    flex: 0 0 3em;
    width: 3em;
    height: 3em;
    text-align: center;
    line-height: 3em;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p1 span{
    font-size: 1.6em;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p1 i{
    font-size: 2em;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p2{
    flex: 1 0 auto;
    width: 40%;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p2 span.sp1{
    display: block;
    font-size: 1.6em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  .songsheet .sheetcontent .songlist>ul.content>li.playbtn>p.p2 span.sp11{
    display: inline-block;
    vertical-align: middle;
    font-size: 1.6em;
    line-height: 1.6em;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p2 span.sp2{
    display: inline-block;
    color: #999;
    font-size: 1.2em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p2 span.sp2 span{
    vertical-align: middle;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p2 span.sp2 i{
    vertical-align: middle;
  }
  .songsheet .sheetcontent .songlist>ul.content>li.playbtn>p.p2 span.sp22{
    display: inline-block;
    color: #999;
    font-size: 1.2em;
    margin-left: .5em;
    vertical-align: middle;
    line-height: 1.6em;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p3{
    flex: 0 0 6em;
    text-align: center;

  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p3 i{
    color: #bbb;
  }
  .songsheet .sheetcontent .songlist>ul.content>li>p.p3 i.icon-yuandiancaidan, .songsheet .sheetcontent .songlist>ul.content>li>p.p3 i.icon-gouxuan{
    margin: 1em;
    font-size: 2em;
  }
</style>
