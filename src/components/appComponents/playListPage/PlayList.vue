<template>
    <div class="playlist" v-if="objIsNull(playList)">
      <transition name="el-fade-in-linear">
      <div class="minplayer transition-box" v-if="isPlayList&&isMenu">
        <div class="minpl">
          <div class="imgcontent" @click="openCloseList({isPage:true,isList: !isPlayList})">
            <div class="img">
              <img v-if="playList[playIndex].imageUrl" v-lazy="playList[playIndex].imageUrl" alt="">
            </div>
            <div class="sname"><span class="span1">{{playList[playIndex].songName}}</span> - <span class="span2">{{playList[playIndex].arName[0].name}}</span></div>
          </div>
          <div class="plbtnmenu">
            <div class="plbtn clearfix">
              <el-progress v-if="!progressBar" :width="28" :stroke-width="2" class="svg" type="circle" :percentage="0" :show-text="false" color="#777"></el-progress>
              <el-progress v-if="progressBar" :width="28" :stroke-width="2" class="svg" type="circle" :percentage="progressBar" :show-text="false" color="#777"></el-progress>
              <i v-if="isPlay" @click="isStop('play')" class="iconfont icon-bofang"></i>
              <i v-if="!isPlay"@click="isStop('stop')" class="iconfont icon-zanting1"></i>
            </div>
            <div class="menubtn"><i class="iconfont icon-zhankai" @click="closeLists"></i></div>
          </div>
        </div>
      </div>
      <div class="minplayer transition-box" v-if="isPlayList&&!isMenu" style="bottom: 0">
        <div class="minpl">
          <div class="imgcontent" @click="openCloseList({isPage:true,isList: !isPlayList})">
            <div class="img">
              <img v-if="playList[playIndex].imageUrl" v-lazy="playList[playIndex].imageUrl" alt="">
            </div>
            <div class="sname"><span class="span1">{{playList[playIndex].songName}}</span> - <span class="span2">{{playList[playIndex].arName[0].name}}</span></div>
          </div>
          <div class="plbtnmenu">
            <div class="plbtn clearfix">
              <el-progress v-if="!progressBar" :width="28" :stroke-width="2" class="svg" type="circle" :percentage="0" :show-text="false" color="#777"></el-progress>
              <el-progress v-if="progressBar" :width="28" :stroke-width="2" class="svg" type="circle" :percentage="progressBar" :show-text="false" color="#777"></el-progress>
              <i v-if="isPlay" @click="isStop('play')" class="iconfont icon-bofang"></i>
              <i v-if="!isPlay"@click="isStop('stop')" class="iconfont icon-zanting1"></i>
            </div>
            <div class="menubtn"><i class="iconfont icon-zhankai" @click="closeLists"></i></div>
          </div>
        </div>
      </div>
        </transition>
        <transition name="el-zoom-in-bottom">
          <div class="maxplayer transition-box" v-if="!isPlayList">
            <div class="plnav">
              <div class="back" @click="openCloseList({isPage:true,isList: !isPlayList})"><i class="iconfont icon-jiantoudown"></i></div>
              <div class="songname">
                <p class="p1">{{playList[playIndex].songName}}</p>
                <p class="p2"><span>{{playList[playIndex].arName[0].name}}</span><i class="iconfont icon-tianjia"></i></p>
              </div>
              <div class="share">
                <p class="p1">
                  <img v-if="playList[playIndex].imageUrl" v-lazy="playList[playIndex].imageUrl" alt="">
                </p>
                <p class="p2"><i class="iconfont icon-fenxiang"></i></p>
              </div>
            </div>
            <div class="playimg">
              <img v-if="playList[playIndex].imageUrl" v-lazy="playList[playIndex].imageUrl" alt="">
            </div>
            <div class="playfn">
              <div class="otherfn">
                <p class="like"><i class="iconfont icon-xihuan"></i></p>
                <p class="install" @click="downloadFile(playList[playIndex].resourceId,playList[playIndex].songName)"><i class="iconfont icon-xiazai"></i></p>
                <p class="ling"><i class="iconfont icon-icon--"></i></p>
                <p class="comment"><i class="iconfont icon-pinglun2"></i></p>
                <p class="songmenu"><i class="iconfont icon-yuandiancaidan"></i></p>
              </div>
              <div class="bar">
                <p class="p1" v-if="!progressBar">00:00</p>
                <p class="p1" v-if="progressBar">{{barCurrentTimes}}</p>
                <p class="p2" ref="proBar" @touchstart="controlsStart" @touchmove="controlsMove" @touchend="controlsEnd">
                  <el-progress v-if="progressBar" :stroke-width="1" :percentage="progressBar" :show-text="false" color="red"></el-progress>
                  <el-progress v-if="!progressBar" :stroke-width="1" :percentage="0" :show-text="false" color="red"></el-progress>
                </p>
                <p class="p3" v-if="!progressBar">00:00</p>
                <p class="p3"  v-if="progressBar">{{barDuration}}</p>
              </div>
              <div class="plfn">
                <p>
                  <i class="iconfont icon-xunhuan1" v-if="isListPlay" @click="changePlayModel('list')"></i>
                  <i class="iconfont icon-xunhuan" v-if="isRandomPlay" @click="changePlayModel('random')"></i>
                  <i class="iconfont icon-hanhan-01-01" v-if="isOncePlay" @click="changePlayModel('once')"></i>
                </p>
                <p><i class="iconfont icon-shangyishoushangyige" @click="isStop('pre')"></i></p>
                <p class="pl">
                  <i class="iconfont icon-bofang3" v-if="isPlay" @click="isStop('play')">
                  </i><i class="iconfont icon-stop" v-if="!isPlay" @click="isStop('stop')"></i></p>
                <p><i class="iconfont icon-xiayigexiayishou" @click="isStop('next')"></i></p>
                <p><i class="iconfont icon-zhankai" @click="closeLists"></i></p>
              </div>
            </div>
          </div>
        </transition>
      <transition name="el-fade-in-linear">
        <div class="songlist transition-box" v-if="isCloseLists">
          <div class="close"  @click="closeLists"></div>
          <div class="lists">
            <div class="listnav">
              <div class="titl"><h2>当前播放<span class="songnum">({{playlitLength}})</span></h2></div>
              <div class="thridfn">
                <p class="p11" v-if="isListPlay"><i class="iconfont icon-xunhuan1" @click="changePlayModel('list')"></i><span>列表循环</span></p>
                <p class="p11" v-if="isRandomPlay"><i class="iconfont icon-xunhuan" @click="changePlayModel('random')"></i><span>随机播放</span></p>
                <p class="p11" v-if="isOncePlay"><i class="iconfont icon-hanhan-01-01" @click="changePlayModel('once')"></i><span>单曲循环</span></p>
                <p class="p22"><i class="iconfont icon-icon-test"></i><span>收藏全部</span> | <i class="iconfont icon-shanchu" @click="delPlayingList(-1)"></i></p>
              </div>
            </div>
            <div class="swiperlist">
              <ul class="content">
                <li v-for="(item,index) in playingList" :key="index" v-if="playingList">
                  <p class="p1" :ref="`playing${index}`" @click="playsongs(index)"><span class="span1">{{item.songName}}</span>-<span class="span2">{{item.arName[0].name}}</span></p>
                  <p class="p2"><i class="iconfont icon-guanbi" @touchstart="delPlayingList(index)"></i></p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
      <audio autoplay ref="plays" @timeupdate="getPlaytimming"></audio>
      <!--style="position: fixed;top: 10%;" controls-->
    </div>
</template>
<script>
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import $ from 'jquery';
  import BScroll from 'better-scroll';
  import axios from 'axios';
    export default {
        data(){
            return {
              isCloseLists:false,
              isPlay:false,
              isListPlay:true,// 列表循环
              isOncePlay:false,//单曲循环
              isRandomPlay:false,//随机循环
              currentTime: 0, // 在播时间
              duration:0, // 总时长
              networkState:0, // 音频就绪状态 3就绪 1连接中
              progressBar:0, // 进度条进度
              barCurrent:'', // 播放中时间
              barSecond:0, //播放中秒数
              barMin:0,  // 播放中分钟数
              barTimer:null, //播放时读秒计时器
              barCount:0,
              allTime:0, //计数器总时长,
              listBs:null,// better-scroll
              playDuration:0, // 歌曲播放时长
              isRightPlay:false, //歌曲是否正常播放
              isOpenSongList:true,//是否显示播放列表
              isPause: -1,
              startX: 0,
              endX: 0,
              isSongError: true,
            }
        },
      computed:{
        ...mapState({
          isPlayList:'isPlayList',
          playList:'playList', // 播放列表
          playIndex:'playIndex', //播放歌曲下标
          songContent:'songContent',
          songId:'songId',
          isOpenSheet: 'isOpenSheet',
          isMenu:'isMenu',
          isSongDetail:'isSongDetail',
        }),
        barDuration(){
          let second = Math.floor(this.duration)%60;
          let min = (Math.floor(this.duration)- second)/60;
          if(second < 10){
            second = '0'+second;
          }
          if(min < 10){
            min = '0'+min;
          }
          return min+':'+second;
        },
        barCurrentTimes(){ //歌曲进度
          this.barSecond = this.barCount;
          if(this.barCount<10){
            this.barSecond = '0'+this.barCount;
          }
          this.barCurrent = this.barMin+':'+ this.barSecond;
          if(this.barMin<10){
            this.barCurrent = '0'+this.barMin+':'+ this.barSecond;
          }
//          console.log(this.barCurrent);
           return this.barCurrent
        },
        playlitLength(){
            return this.playList.length
        },
        playingList(){
          return this.playList
        },
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
            openCloseList:'openCloseList',
            changeIndex:'changeIndex',
            changePlayList:'changePlayList',
            getPlayList:'getPlayList'
          }),
          ...mapActions({
            checkSong:'checkSong'
          }),
          playSongs(playIndex){
            this.$refs.plays.src=`https://music.163.com/song/media/outer/url?id=${this.playList[playIndex].resourceId}.mp3 `;
          },
          isStop(tip){ //播放、暂停、上一首、下一首
            let songIndex = 0;
            clearInterval(this.barTimer)
            this.barTimer = null;
            songIndex = this.playIndex;
            if(this.networkState === 1){
              if(tip == 'play'){
                this.$refs.plays.play();
                this.isPlay = false;
                this.barCurrentTime(this.duration)
              }
              if(tip == 'stop'){
                this.$refs.plays.pause();
                this.isPlay = true;
              }
            }
              if(tip == 'pre'){
                  if(songIndex > 0){
                    songIndex--;
                  }else{
                    songIndex = this.playList.length-1
                  }
                  this.isSongError = false;
              }
              if(tip == 'next'){
                if(songIndex < this.playList.length-1){
                  songIndex++;
                }else{
                    songIndex = 0;
                }
                this.isSongError = false;
              }
              this.changeIndex(songIndex)
          },
          getPlaytimming(e){ // 获取播放时间
             sessionStorage.setItem('currentTime',JSON.stringify(e.target.currentTime));
              this.currentTime = JSON.parse(sessionStorage.getItem('currentTime'));
              this.networkState = e.target.networkState;
              this.playDuration = e.target.duration;
          },
          barCurrentTime(){ // 进度条歌曲进度
            clearInterval(this.barTimer)
            this.barTimer = null;
            let duration = this.duration;
            let second = duration%60;
            let min = (duration-second)/60;
            console.time(this.timer)
            if(!this.barTimer&&duration){
              this.barTimer = setInterval(()=>{
                this.allTime = Number(this.barMin)*60+Number(this.barSecond);
                if(this.allTime<duration){
                    if(this.currentTime){
                        if(this.currentTime<60){
                          this.barCount = Math.floor(this.currentTime)
                        }else{
                          this.barCount =  Math.floor(this.currentTime)%60;
                          this.barMin = (Math.floor(this.currentTime)-this.barCount)/60;
                        }
                    }
                  this.barCount++;
                  if(this.barCount>59){
                    this.barCount=0;
                    this.barMin++;
                  }
                }else{
                  clearInterval(this.barTimer)
                  this.barTimer = null;
                  this.barCurrent='';
                  this.barSecond = 0;
                  this.barMin = 0;
                  this.allTime = 0;
                  this.barCount = 0;
                }
              },1000)
              console.timeEnd(this.timer)
            }
          },
          oncePlay(songIndex){
            this.duration = 0;
            this.progressBar = 0;
            clearInterval(this.barTimer)
            this.barTimer = null;
            this.barCurrent='';
            this.barSecond = 0;
            this.barMin = 0;
            this.allTime = 0;
            this.barCount = 0;
            this.duration = this.playList[songIndex].duration/1000;
            this.playSongs(songIndex);
            this.barCurrentTime()
          },
          changePlayModel(sign){ // 播放模式： 列表循环，单曲循环、随机循环
            let songIndex = 0;
            songIndex = this.playIndex;
            if(sign == 'list'){this.isListPlay = false;this.isRandomPlay = true;this.isOncePlay = false;}
            if(sign == 'random'){this.isRandomPlay =false ;this.isListPlay = false;this.isOncePlay = true;}
            if(sign == 'once'){this.isListPlay = true;this.isRandomPlay = false;this.isOncePlay = false;}
            if(sign == 'model'){
              clearInterval(this.barTimer)
              this.barTimer = null;
              this.progressBar = 0;
            if(this.isListPlay){ // 列表播放
              if(songIndex < this.playList.length-1){
                songIndex++;
              }else{
                songIndex = 0;
                this.oncePlay(songIndex)
              }
            }
            if(this.isRandomPlay){ // 随机播放
                songIndex = Math.ceil((Math.random()*(this.playList.length-1)));
                if(songIndex ===this.playIndex){
                  this.oncePlay(songIndex)
                }
            }
              this.isPlay = false;
              if(this.isOncePlay){ // 单曲循环
                songIndex = this.playIndex;
                this.oncePlay(songIndex)
              }
              console.log(songIndex)
              this.changeIndex(songIndex)
              this.$forceUpdate()
            }
          },
          closeLists(){ // 打开或关闭播放列表
            this.isCloseLists = !this.isCloseLists;
            if(this.isCloseLists){
              this.$nextTick(()=>{
                this.listBs = new BScroll('.swiperlist',{scrollY:true,click:true});
                this.listBs.scrollToElement(this.$refs[`playing${this.playIndex}`][0],0,0);//打开滚动到播放歌曲
              })
            }else{
              this.listBs = null
            }
          },
          delPlayingList(index){ // 删除播放列表的歌曲
            if(index === -1){
              this.openCloseList({isPage:false,isList: false});
              this.changeIndex(0);
              this.changePlayList(index);
            }
              if(this.playList.length>1){
                this.changePlayList(index);
                if(index>=0){ //当删除的歌曲下标大于0
                  if(index === this.playIndex){ //如果下标与播放歌曲下标相同
                    if(index < (this.playList.length)){ //播放歌曲下标与删除下标相同且不处于播放列表最后一个
                      this.changeIndex(index)
                    }else if(index ===(this.playList.length)){
                      this.changeIndex(index-1)//播放歌曲下标与删除下标相同且处于播放列表最后一个
                    }
                  }else if(index<this.playIndex){ //删除下标少于播放歌曲下标
                    this.changeIndex(this.playIndex-1)
                  }
                }
              }else{
                this.openCloseList({isPage:false,isList: false});
                this.changePlayList(index);
              }
              this.$forceUpdate()
          },
          playsongs(playx){
            this.changeIndex(playx)
          },
          controlsStart(e){
            e.preventDefault();
            if(e.touches){
                this.startX = e.touches[0].clientX;
            }
          },
          controlsMove(e){
            e.preventDefault()
          },
          controlsEnd(e){
            e.preventDefault()
            if(e.changedTouches){
                  this.endX = e.changedTouches[0].clientX;
              }
              if((this.endX>=this.$refs.proBar.offsetLeft)&&(this.endX<(this.$refs.proBar.offsetLeft+this.$refs.proBar.offsetWidth))){
                this.progressBar = (((this.endX-this.$refs.proBar.offsetLeft)/this.$refs.proBar.offsetWidth)*100);
                this.$refs.plays.currentTime = ((this.progressBar/100)*this.playDuration);
                            console.log(this.$refs.plays.currentTime)
                             if(Math.floor(this.$refs.plays.currentTime)<60){
                               this.barCount = Math.floor(this.$refs.plays.currentTime);
                               this.barMin = 0;
                             }else{
                               this.barCount = Math.floor(this.$refs.plays.currentTime)%60;
                               this.barSecond = this.barCount;
                               this.barMin = (Math.floor(this.$refs.plays.currentTime)-this.barSecond)/60;
                             }
              }
          },
          songError(delay){
              let timer = null;
            this.$refs.plays.addEventListener("error",(e)=> {
              if(this.isSongError){
                timer=setTimeout(()=>{
                  console.log(this.playIndex)
                  if(this.playIndex < this.playList.length - 1){
                    this.changeIndex(this.playIndex+1);
                  }else{
                    this.changeIndex(0);
                  }
                  clearTimeout(timer);
                  timer = null;
                },delay)
              }
            });
          },
          downloadFile(mid,name) {//下载文件
            let url = `/music/song/media/outer/url?id=${mid}.mp3 `;
            axios({
              method: 'get',
              responseType: 'blob',
              url:url,
            }).then(res=>{
              if(!res){
                this.$message({
                  message: '歌曲下载失败',
                  type: 'error',
                  offset: 0,
                });
                return
              }
              let blobUrl = window.URL.createObjectURL(res.data);
              let a = document.createElement("a");
              document.body.appendChild(a);
              a.style.display = 'none';
              a.href = blobUrl;
              // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
              a.download = `${name}.mp3`;
              // 自触发click事件
              a.click()
              document.body.removeChild(a)
              window.URL.revokeObjectURL(blobUrl);
              this.$message({
                message: '歌曲正在下载',
                type: 'success',
                offset: 0,
              });
            })
          },
        },
      watch:{
        songId(news,old){
//            console.log(news)
          if(news!==old){
              if(!this.timer){
                this.oncePlay(this.playIndex)
              }
            }
        },
        networkState(news,old){ //歌曲网络连接是否正常
            if(news ===  1){
              this.isPlay = false;
            }else{
              this.isPlay = true;
            }
          this.$forceUpdate()
        },
        progressBar(news,old){ //进度条是否不变
            if(news === old){
              clearInterval(this.barTimer)
              this.barTimer = null;
            }
        },
        currentTime(news,old){ //监控正在播放时间
          this.progressBar = (news/this.playDuration)*100;
           if(news === this.playDuration){
              this.isSongError = true;
              this.changePlayModel('model');
           }
        },

      },
      updated(){
        if(this.isCloseLists){
          this.$nextTick(()=>{
            this.playList.forEach((item, index)=>{
              if(this.playIndex === index){
                this.$refs[`playing${index}`][0].children[0].style.color='red';
                this.$refs[`playing${index}`][0].children[1].style.color='red';
              }else{
                this.$refs[`playing${index}`][0].children[0].style.color='#000';
                this.$refs[`playing${index}`][0].children[1].style.color='#888';
              }
            })
          })
        }
      },
      mounted(){
            if(this.playList){
                this.oncePlay(this.playIndex)
                this.songError(4000)
            }
            this.$nextTick(()=>{
                window.addEventListener('enter',(e)=>{
                    console.log(e)
                })
            })
      },
      created(){
          if(this.networkState == 1){
            this.isPlay = false;
          }else{
            this.isPlay = true;
          }
      },
      beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin: 0;
    padding:0;
  }
  .clearfix:after{
    content: '';
    display: block;
    clear: both;
    overflow: hidden;
  }
  .playlist{
    position: relative;
    top: 0;
    bottom: 0;
    width: 0;
    height: 0;
    font-size: 10px;
    z-index: 3;
  }
  .minplayer{
    position: fixed;
    left: 0;
    bottom: 6em;
    width: 100%;
    height: 4em;
    background: #fff;
    border-top: .1em solid #eef;
    z-index: 4;
  }
  .minpl{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 1.4em;
  }
  .minpl .imgcontent{
    width: 70%;
    text-align: left;
  }
  .minpl .imgcontent .img{
    margin-right: 1em;
    vertical-align: middle;
  }
  .minpl .imgcontent .img img{
    width: 4em;
    height: 4em;
    border-radius: 50%;
    vertical-align: middle;
  }
  .minpl .imgcontent .sname{
    width: 71%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
  .minpl .imgcontent .sname span.span1{
    font-size: 1.4em;
    vertical-align: middle;
  }
  .minpl .imgcontent .sname span.span2{
    font-size: 1.2em;
    color: #888;
    vertical-align: middle;
  }
  .minpl .imgcontent>div, .minpl .plbtnmenu>div{
    display: inline-block;
  }
  .minpl .plbtnmenu{
    width: 30%;
  }
  .minpl .plbtnmenu .plbtn{
    position: relative;
    top: 0;
    left: 0;
    vertical-align: middle;
  }
  .minpl .plbtnmenu .plbtn .svg{
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;
    margin-top: -1.4em;
    margin-left: -1.4em;
  }
  .minpl .plbtnmenu .plbtn i {
    font-size: 1.6em;
    left: 50%;
    height: 100%;
    width: 100%;
  }
  .minpl .plbtnmenu .menubtn{
    margin-left:2em;
    vertical-align: middle;
  }
  .minpl .plbtnmenu .menubtn i{
    font-size: 2.4em;
  }
  .maxplayer{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.9);
    z-index: 4;
  }
  .plnav{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .plnav .back{
    margin: 2em 1.4em;
    flex: 0 0 18%;
    text-align: left;
  }
  .plnav .back i{
    color: #fff;
    font-size: 2em;
  }
  .plnav .songname{
    flex: 0 0 auto;
    margin: 1em;
    color: #fff;
  }
  .plnav .songname p.p1{
    margin: 0 auto;
    font-size: 1.6em;
    width: 8em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

  }
  .plnav .songname p.p2{
    margin: 0 auto;
    width: 8em;
    font-size: 1.2em;
    color: #888;

  }
  .plnav .songname p.p2 span, .plnav .songname p.p2 i{
    vertical-align: middle;
  }
  .plnav .songname p.p2 span{
    width: 82%;
    display: inline-block;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .plnav .share{
    flex: 0 0 18%;
    margin: 1em;
    color: #fff;
  }
  .plnav .share p{
    display: inline-block;
  }
  .plnav .share p.p1 img{
    margin-right: 1em;
    width: 3em;
    height: 3em;
    border-radius: 50%;
    vertical-align: middle;
  }
  .plnav .share p.p2{
    vertical-align: middle;
  }
  .playimg{
    position: absolute;
    left: 50%;
    top: 40%;
    margin-top: -12em;
    margin-left: -12em;
  }
  .playimg img{
    width: 24em;
    height: 24em;
    border-radius: 50%;
  }
  .playfn{
    position: fixed;
    left: 0;
    bottom: 1%;
    width: 100%;
  }
  .playfn .otherfn{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 2em 0;
    color: #fff;
  }
  .playfn .otherfn p i{
    font-size: 2.4em;
  }
  .playfn .bar p{
    display: inline-block;
    width:4em;
    color: #fff;
    vertical-align: middle;
  }
  .playfn .bar p.p2{
    margin: 0 .5em;
    width: 60%;
  }
  .playfn .plfn{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 2em 0;
    color: #fff;
  }
  .playfn .plfn p i{
    font-size: 2.2em;
  }
  .playfn .plfn p.pl i{
    font-size: 4.4em;
  }
  .songlist{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.6);
    font-size: 10px;
    z-index: 4;
    overflow: hidden;
  }
  .songlist .close{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 4;
  }
  .songlist .lists{
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -16em;
    margin-bottom: 2em;
    width: 32em;
    height: 40em;
    background: #fff;
    border-radius: 1.5em;
    overflow: hidden;
    z-index: 5;
  }
  .listnav{
    margin: 0 2em;
    list-style-type: none;
    text-align: left;
  }
  .listnav div.thridfn{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1em 0;
  }
  .listnav>div.titl>h2{
    margin: 1em 0;
    font-size: 1.6em;
  }
  .listnav div.titl>h2 span.songnum{
    font-size: 14px;
  }
  .listnav div.thridfn>p.p11{
    margin: .2em;
    font-size: 1.4em;
    line-height: 1.4em;
  }
  .listnav div.thridfn>p.p11>span{
    display: inline-block;
    margin-left: .4em;
    vertical-align: middle;
  }
  .listnav div.thridfn>p.p11>i{
    vertical-align: middle;
  }
  .listnav div.thridfn>p.p22{
    font-size: 1.4em;
    line-height: 1.4em;
  }
  .listnav div.thridfn>p.p22>span{
    margin: 0 .4em;
    vertical-align: middle;
  }
  .listnav div.thridfn>p.p22>i{
    margin-left: .4em;
    vertical-align: middle;
  }
  .swiperlist{
    height: 40em;
    overflow: hidden;
  }
  .songlist .lists .swiperlist ul.content{
    padding-bottom: 12em;
    list-style-type: none;
    border-radius: 1.5em;
  }
  .songlist .lists .swiperlist ul.content>li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2em 2em;
    border-radius: 1.5em;
  }
  .songlist .lists .swiperlist ul.content li p.p1{
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 25em;
    text-align: left;
  }
  .songlist .lists .swiperlist ul.content li p.p1 span.span1{
    font-size: 1.5em;
  }
  .songlist .lists .swiperlist ul.content li p.p1 span.span2{
    font-size: 1.2em;
    color: #888;
  }
</style>
