<template>
   <div class="wrapper">
     <div class="loading" v-if="!loading">
       <img src="../../../assets/images/loading6.gif"  alt="">
     </div>
     <div class="myfound" v-if="loading">
       <div class="bar" v-if="objIsNull(banners)">
         <div class="banner" v-if="banners">
           <ul class="ull">
             <li v-for="(item, index) in banners"
                 :key="index"
                 @touchstart.stop.prevent="touchStart"
                 @touchend.stop.prevent="touchEnd">
               <img :src="item.pic" alt="">
             </li>
           </ul>
         </div>
         <ul class="btn">
           <li v-for="(i,index) in banners.length" :key="i" @touchstart.stop.prevent="runBanner(index)"></li>
         </ul>
       </div>
       <div class="otherFn">
         <ul>
           <li @touchstart.stop.prevent="arletTip"><i class="iconfont icon-jinrituijian"></i><p>今日推荐</p></li>
           <li @touchstart.stop.prevent="arletTip"><i class="iconfont icon-FM_weixuanze"></i><p>私人FM</p></li>
           <li @touchstart.stop.prevent="openAllSheet('推荐')"><i class="iconfont icon-gedan"></i><p>歌单</p></li>
           <li @touchstart.stop.prevent="arletTip"><i class="iconfont icon-paihangbang"></i><p>排行榜</p></li>
           <li @touchstart.stop.prevent="arletTip"><i class="iconfont icon-zhuanji"></i><p>数字专辑</p></li>
         </ul>
         <el-divider></el-divider>
       </div>
       <div class="RecSonglist" v-if="objIsNull(rcmdList)">
         <div class="title">
           <h2>推荐歌单</h2>
           <p @touchstart="openAllSheet('推荐')">
             <span>更多</span><i class="iconfont icon-arrow-right"></i>
           </p>
         </div>
         <div class="recontent">
           <ul class="recul">
             <li v-for="(item,index) in rcmdList" :key="index" @click="openCloseSheet(item.creativeId)">
               <p class="img">
                 <img v-lazy="item.uiElement.image.imageUrl" :key="index" alt="">
                 <span><i class="iconfont icon-bofang1">{{item.resources[0].resourceExtInfo.playCount | playCounts(item.resources[0].resourceExtInfo.playCount)}}</i></span>
               </p>
               <p class="text">{{item.uiElement.mainTitle.title}}</p>
             </li>
           </ul>
         </div>
       </div>
       <div class="selectedRcmdSong" v-if="objIsNull(selectedRcmdSong)">
         <div class="title borderRadius">
           <h2><i class="iconfont icon-icon_refresh"></i>{{selectTitle}}</h2>
           <p @touchstart="playSong(null)">
             <i class="iconfont icon-play"></i><span>播放</span>
           </p>
         </div>
         <div class="selSongContent">
           <ul class="selSongul">
             <li v-for="(item,index) in selectedRcmdSong.creatives" :key="index">
               <ul v-for="(item2,index2) in item.resources" :key="index2">
                 <li>
                   <div class="img" @click="playSong(item2)"><img v-lazy="item2.uiElement.image.imageUrl" :key="index2" alt=""></div>
                   <div class="songname" @click="playSong(item2)">
                       <p class="p1"><span class="span1">{{item2.resourceExtInfo.songData.name}}</span>-<span class="span2">{{item2.resourceExtInfo.artists[0].name}}</span></p>
                       <!--<p class="p2" v-if="item2.resourceExtInfo.commentSimpleData"><span>{{item2.resourceExtInfo.commentSimpleData.content}}</span></p>-->
                       <p class="p2" v-if="item2.uiElement.subTitle"><span>{{item2.uiElement.subTitle.title}}</span></p>
                   </div>
                   <div class="videoico"><i class="iconfont icon-shipin"></i></div>
                 </li>
                 <el-divider class="link" v-if="index2<=1"></el-divider>
               </ul>
             </li>
           </ul>
         </div>
       </div>
       <div class="selectVideo" v-if="isVd && objIsNull(selectedMVideo)">
         <div class="title borderRadius">
           <h2 v-if="selectedMVideo.uiElement">{{selectedMVideo.uiElement.subTitle.title}}</h2>
           <p><i class="iconfont icon-icon_refresh"></i><span>换一批</span></p>
         </div>
         <div class="videocontent">
           <ul class="content clearfix">
             <li v-for="(item,index) in selectedMVideo.extInfo" :key="index">
               <p class="p1">
                 <img class="img" :ref="`img${index}`" v-lazy="item.resource.mlogBaseData.coverUrl" :key="index"  alt="">
                 <video class="video" loop muted  x5-video-player-type="h5-page" :src="videoUrls[index]" style="display: none"  preload :ref="`video${index}`" type="video/mp4" crossorigin="anonymous"></video>
                 <span><i class="iconfont icon-bofang1">{{item.resource.mlogExtVO.playCount | playCounts(item.resource.mlogExtVO.playCount)}}</i></span>
                 <i class="iconfont icon-play playStop pla" :ref="`pla${index}`" @click="getVdieoUrls(item,index,'play')"></i>
                 <i class="iconfont icon-zhengzaibofang playStop sto" :ref="`st${index}`" @click="getVdieoUrls(item,index,'pause')" style="display: none"></i>
               </p>
               <p class="p2">{{item.resource.mlogBaseData.text}}</p>
             </li>
           </ul>
         </div>
       </div>
       <div class="radar RecSonglist" v-if="isRa && objIsNull(radarList)">
         <div class="title borderRadius">
           <h2 v-if="radarList.uiElement">{{radarList.uiElement.subTitle.title}}</h2>
           <p @touchstart.stop.prevent="openAllSheet('官方')">
             <span>更多</span><i class="iconfont icon-arrow-right"></i>
           </p>
         </div>
         <div class="radarcontent recontent">
           <ul class="recul">
             <li v-for="(item,index) in radarList.creatives" :key="index" @click="openCloseSheet(item.creativeId)">
               <p class="img">
                 <img v-lazy="item.uiElement.image.imageUrl" :key="index" alt="">
                 <span><i class="iconfont icon-bofang1">{{item.resources[0].resourceExtInfo.playCount | playCounts(item.resources[0].resourceExtInfo.playCount)}}</i></span>
               </p>
               <p class="text">{{item.uiElement.mainTitle.title}}</p>
             </li>
           </ul>
         </div>
       </div>
       <div class="hot RecSonglist" v-if="isHot && objIsNull(hotPodcast)">
         <div class="title borderRadius">
           <h2 v-if="hotPodcast.uiElement">{{hotPodcast.uiElement.subTitle.title}}</h2>
           <p>
             <span>更多</span><i class="iconfont icon-arrow-right"></i>
           </p>
         </div>
         <div class="hotcontent recontent">
           <ul class="recul">
             <li v-for="(item,index) in hotPodcast.creatives" :key="index" @click="arletTip">
               <p class="img">
                 <img v-lazy="item.uiElement.image.imageUrl" :key="index" alt="">
                 <span><i class="iconfont icon-bofang1">{{item.creativeExtInfoVO.playCount | playCounts(item.creativeExtInfoVO.playCount)}}</i></span>
               </p>
               <p class="text">
                 <!--<span class="reason">{{item.algReason}}</span>-->
                 {{item.uiElement.mainTitle.title}}</p>
             </li>
           </ul>
         </div>
       </div>
       <div class="scene RecSonglist" v-if="isScene && objIsNull(sceneList)">
         <div class="title borderRadius">
           <h2 v-if="sceneList.uiElement">{{sceneList.uiElement.subTitle.title}}</h2>
           <p @touchstart="openAllSheet('官方')">
             <span>更多</span><i class="iconfont icon-arrow-right"></i>
           </p>
         </div>
         <div class="scenecontent recontent">
           <ul class="recul">
             <li v-for="(item,index) in sceneList.creatives" :key="index" @click="openCloseSheet(item.creativeId)">
               <p class="img">
                 <img v-lazy="item.uiElement.image.imageUrl" alt="">
                 <span><i class="iconfont icon-bofang1">{{item.resources[0].resourceExtInfo.playCount | playCounts(item.resources[0].resourceExtInfo.playCount)}}</i></span>
               </p>
               <p class="text">{{item.uiElement.mainTitle.title}}</p>
             </li>
           </ul>
         </div>
       </div>
       <div class="newSong RecSonglist selectedRcmdSong clearfix" v-if="isNews">
         <div class="titlenav title borderRadius">
           <div class="navs">
             <span class="songs" @touchstart.prevent="goSwitch(0,'新歌')" style="color: #000">新歌</span>
             <i class="iconfont icon-vertical_line" style="color: #aaa"></i>
             <span class="dies" @touchstart.prevent="goSwitch(1,'新碟')">新碟</span>
             <i class="iconfont icon-vertical_line" style="color: #aaa"></i>
             <span class="num" @touchstart.prevent="goSwitch(2,'数字专辑')" >数字专辑</span>
           </div>
           <p @touchstart.stop.prevent="openMoreSheet">
             <span>更多</span><i class="iconfont icon-arrow-right"></i>
           </p>
         </div>
         <div class="songDieNum">
           <ul class="selSongul" v-if="objIsNull(newsNumSong)">
             <li v-for="(item,index) in newsNumSong" :key="index">
               <ul v-for="(item2,index2) in item.resources" :key="index2">
                 <li>
                   <div class="img" @click="playNewsSongs(item2,item.uiElement.mainTitle.title)"><img v-lazy="item2.uiElement.image.imageUrl" :key="index2" alt=""></div>
                   <div class="songname" @click="playNewsSongs(item2,item.uiElement.mainTitle.title)">
                     <p class="p1">
                       <span class="span1" v-if="item2.resourceExtInfo.songData">{{item2.resourceExtInfo.songData.name}}</span>
                       <span class="span1" v-if="!item2.resourceExtInfo.songData">{{item2.uiElement.mainTitle.title}}</span>
                        -<span class="span2">{{item2.resourceExtInfo.artists[0].name}}</span>
                     </p>
                     <p class="p2" v-if="item2.uiElement.subTitle"><span>{{item2.uiElement.subTitle.title}}</span></p>
                   </div>
                   <div class="videoico"><i class="iconfont icon-shipin"></i></div>
                 </li>
                 <el-divider class="link" v-if="index2<=1"></el-divider>
               </ul>
             </li>
           </ul>
         </div>
         <!--<el-divider style="margin: 0 1.4em"></el-divider>-->
         <!--<div class="extend" v-if="extend.uiElement">-->
           <!--<div class="extendtitle">{{extend.uiElement.subTitle.title}}</div>-->
           <!--<div class="extendsong">-->
             <!--<ul class="content">-->
               <!--<li v-for="(item,index) in extend.creatives" :key="index">-->
                 <!--<div class="extendcontent">-->
                   <!--<div class="img" @click="playNewsSongs(item.resources[0],'推广')" ><img :src="item.resources[0].uiElement.image.imageUrl" alt=""></div>-->
                   <!--<div class="songname" @click="playNewsSongs(item.resources[0],'推广')">-->
                     <!--<p class="p1">-->
                       <!--<span class="span1" v-if="item.resources[0].resourceExtInfo.songData">{{item.resources[0].resourceExtInfo.songData.name}}</span>-->
                       <!--<span class="span1" v-if="!item.resources[0].resourceExtInfo.songData">{{item.resources[0].uiElement.mainTitle.title}}</span>-->
                       <!-- -<span class="span2">{{item.resources[0].resourceExtInfo.artists[0].name}}</span>-->
                     <!--</p>-->
                     <!--<p class="p2" v-if="item.resources[0].uiElement.subTitle"><span>{{item.resources[0].uiElement.subTitle.title}}</span></p>-->
                   <!--</div>-->
                 <!--</div>-->
               <!--</li>-->
             <!--</ul>-->
           <!--</div>-->
         <!--</div>-->
       </div>
       <!--<div class="RecSonglist musicCal" v-if="isCal">-->
         <!--<div class="title borderRadius">-->
           <!--<h2 v-if="musicCalendar.uiElement">{{musicCalendar.uiElement.subTitle.title}}</h2>-->
           <!--<p v-if="musicCalendar.uiElement">-->
             <!--<span>{{musicCalendar.uiElement.button.text}}</span><i class="iconfont icon-arrow-right"></i>-->
           <!--</p>-->
         <!--</div>-->
         <!--<div class="luck">-->
           <!--<p class="text">领取你的今日好运</p>-->
           <!--<p class="btn"><span>查看运势解读</span><i class="iconfont icon-arrow-right"></i></p>-->
         <!--</div>-->
         <!--<div class="calContent" v-if="musicCalendar.creatives">-->
               <!--<div class="today">-->
                 <!--<div class="txt">-->
                   <!--<p class="p1"><span class="sp1">今天</span><span  class="sp2">{{cutLongStr}}</span></p>-->
                   <!--<p class="p2">{{cutLongStr0}}</p>-->
                 <!--</div>-->
                 <!--<div class="img"><img :src="musicCalendar.creatives[0].resources[0].uiElement.image.imageUrl"  alt=""></div>-->
               <!--</div>-->
           <!--<el-divider class="link"></el-divider>-->
               <!--<div class="tomorrer">-->
                 <!--<div class="txt">-->
                   <!--<p class="p1"><span class="sp1">{{computedTime}}</span><span class="sp2">预告</span></p>-->
                   <!--<p class="p2">{{cutLongStr1}}</p>-->
                 <!--</div>-->
                 <!--<div class="people">-->
                   <!--<p><i class="iconfont icon-lingdang"></i></p>-->
                   <!--<p>{{musicCalendar.creatives[1].resources[0].resourceExtInfo.subCount | playCounts(musicCalendar.creatives[1].resources[0].resourceExtInfo.subCount)}}</p>-->
                 <!--</div>-->
                 <!--<div class="img"><img :src="musicCalendar.creatives[1].resources[0].uiElement.image.imageUrl" alt=""></div>-->
               <!--</div>-->
         <!--</div></div>-->
       <div class="h24 RecSonglist" v-if="is24h && objIsNull(h24Podcast)">
         <div class="title borderRadius">
           <h2 class="htitle" v-if="h24Podcast.length == 0?false:true"><span @touchstart.prevent="switchRa(0)">{{h24Podcast[0].uiElement.mainTitle.title}}</span><i class="iconfont icon-vertical_line" style="color: #aaa;font-size: 1em"></i><span style="color: #aaa" @touchstart="switchRa(1)">{{h24Podcast[1].uiElement.mainTitle.title}}</span></h2>
         </div>
         <div class="recontent h24Content">
           <ul class="recul">
             <li v-for="(item,index) in radioSetData.resources" :key="index" @click="arletTip">
               <p class="img h24img">
                 <img v-lazy="item.uiElement.image.imageUrl" :key="index" alt="">
                 <span class="play"><i class="iconfont icon-bofang"></i></span>
               </p>
               <p class="text h24text">{{item.uiElement.mainTitle.title}}</p>
             </li>
           </ul>
         </div>
       </div>
       <div class="videoCol RecSonglist" v-if="isVideo && objIsNull(videoCollection)">
         <div class="title borderRadius">
           <h2 v-if="videoCollection.uiElement">{{videoCollection.uiElement.subTitle.title}}</h2>
           <p @touchstart.stop.prevent="openAllSheet('视频歌单')">
             <span>更多</span><i class="iconfont icon-arrow-right"></i>
           </p>
         </div>
         <div class="recontent videoContent">
           <ul class="recul">
             <li v-for="(item,index) in videoCollection.creatives" :key="index">
               <p class="img">
                 <img v-lazy="item.uiElement.image.imageUrl" :key="index" alt="" @click="openCloseSheet(item.creativeId)">
                 <span><i class="iconfont icon-bofang1">{{item.resources[0].resourceExtInfo.playCount | playCounts(item.resources[0].resourceExtInfo.playCount)}}</i></span>
               </p>
               <p class="text">{{item.uiElement.mainTitle.title}}</p>
             </li>
           </ul>
         </div>
       </div>
       <div class="rufreshbtn RecSonglist" v-loading="isLoadingOther">
         <div class="btn" @touchstart.stop.prevent="isRufreshPage">
           <i class="iconfont icon-icon_refresh"></i>
           <span>点击刷新</span>
           <span class="span2">换一批内容</span>
         </div>
       </div>
     </div>
   </div>
</template>
<script>
  import axios from 'axios'
  import $ from 'jquery'
  import BScroll from 'better-scroll'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
    export default {
        emit:['mouseover','mouseout'],
        data() {
          return{
            loading:true,
            isLoadingOther: true,
            banners:{},//轮播图
            rcmdList:{}, //推荐歌单
            newSong:{},// 新歌/新碟/数字专辑
            newsNumSong:[],
            extend:{},// 推广新歌
            selectedMVideo:{},//精选音乐视频
            videoUrls:'', //音乐视频地址
            selectedRcmdSong:{},//推荐歌曲精选
            playlist:[], // 播放列表
            selectTitle:'',
            musicCalendar:{},//音乐日历
            radarList:{},//雷达歌单
            sceneList:{},// 专属场景歌单
            hotPodcast:{},//热门博客
            h24Podcast:{},//播客
            radioSetData:{},//广播电台/24小时播客
            videoCollection:{},//视频合辑
            myFoundData:{}, //主页面所有数据
            timer: null,
            count: 0,
            startX:0,
            endX:0,
            changeCount:false,
            recBs:null, // 推荐歌单滚动
            allBs:null, //发现页面滚动
            selBs:null,//精品音乐推荐滚动
            vdBs: null, //音乐视频滚动
            raBs: null, // 雷达歌单滚动
            hotBs:null, //热门播客滚动
            sceneBs:null, //场景歌单滚动
            newBs: null, // 新歌滚动
            exBs:null, //推广新歌滚动
            h24Bs: null,// 广播滚动
            vdcBs: null, //视频合辑滚动
            allScrollY:0,
            maxScrollY: 0,
            isRa: false,
            isHot: false,
            isVd: false,
            isScene: false,
            isNews:false,
            isCal:false,
            is24h: false,
            isVideo: false,
            songSign: '新歌',
            runCount:0,
            vdBsMaxScrollX: 0,
            vdBsScrollX: 0,
            preventTimer:null,
            firstV: false,
            secondV: false,
            thridV:false,
            fourthV:false,
          }
        },
        methods:{
          ...mapMutations({
            openCloseList:'openCloseList',
            getPlayList:'getPlayList',
            changeIndex:'changeIndex',
            openSheet:'openSheet',
            getSheetSong:'getSheetSong',
            openMoreSheet:'openMoreSheet',
            changeActiveTip:'changeActiveTip'
          }),
          ...mapActions({
            getKeyWords:'getKeyWords',
            openAllSheets:'openAllSheets'
          }),
          getMyFound(){
              this.loading = false;
              if(!sessionStorage.getItem('myFoundData')){
                axios.get('https://my-wyy.vercel.app/homepage/block/page?refresh=true&realIP=116.25.146.177').then(res=>{
                  if(res.data.code == '200'){
                    res.data.data.blocks.forEach(ele=>{
                      if(ele.blockCode=="HOMEPAGE_BANNER"){this.banners = ele.extInfo.banners}
                      if(ele.blockCode=="HOMEPAGE_BLOCK_PLAYLIST_RCMD"){this.rcmdList = ele.creatives}
                      if(ele.blockCode=="HOMEPAGE_MUSIC_MLOG"){this.selectedMVideo = ele}
                      if(ele.blockCode=="HOMEPAGE_BLOCK_STYLE_RCMD"){this.selectedRcmdSong = ele}
                      if(ele.blockCode=="HOMEPAGE_BLOCK_MGC_PLAYLIST"){this.radarList = ele}
                      if(ele.blockCode=="HOMEPAGE_VOICELIST_RCMD"){this.hotPodcast = ele}
                      if(ele.blockCode=="HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST"){this.sceneList = ele}
                      if(ele.blockCode=="HOMEPAGE_YUNBEI_NEW_SONG"){this.extend = ele}
                      if(ele.blockCode=="HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG"){this.newSong =ele.creatives}
                      if(ele.blockCode=="HOMEPAGE_PODCAST24"){this.h24Podcast = ele.creatives}
                      if(ele.blockCode=="HOMEPAGE_BLOCK_VIDEO_PLAYLIST"){this.videoCollection = ele}
                      })
                    this.loading = true;
                    if(this.objIsNull(this.selectedRcmdSong)){
                      this.selectTitle = this.selectedRcmdSong.uiElement.subTitle.title;
                      this.getList(this.selectedRcmdSong.creatives)
                    }
                    if(this.objIsNull(this.h24Podcast)){
                        this.radioSetData = this.h24Podcast[0];
                    }
                    sessionStorage.setItem('myFoundData',JSON.stringify(res.data.data.blocks))
                  }else{}
                })
              }else{

              }
          },
          getBtn(index){ // 轮播图button移动效果
            this.count = index;
              $('.ull>li').eq(index).fadeIn('slow').css('display','block');
              $('.ull>li').eq(index).siblings().fadeOut('slow').css('display','none');
//            $('.ull').animate({marginLeft: -this.count*32+"em"})
            $('.btn li').eq(this.count).css("background","#ddd")
            $('.btn li').eq(this.count).siblings().css("background","#aaa")
          },
          runBanner(index=0){ // 轮播图
            clearInterval(this.timer);
            this.timer = null;
            let i = index;
            this.count = index;
            this.getBtn(this.count)
            this.timer = setInterval(()=>{
                this.count = i;
              if(i>this.banners.length-1){
                i= 0;
                clearInterval(this.timer);
                this.timer = null;
                this.runBanner()
              }
              this.getBtn(i)
              i++;
            },4000)
          },
          touchStart(e){ // 轮播图手动切换
            clearInterval(this.timer);
            this.timer = null;
            this.changeCount = false;
              e.preventDefault()
            if(e.touches.length == 1){
                  this.startX = e.touches[0].clientX
            }
          },
          touchEnd(e){ // // 轮播图手动切换

            e.preventDefault()
            if(e.changedTouches.length == 1){
                this.endX = e.changedTouches[0].clientX
              if(this.endX !== this.startX){
                if((this.endX-this.startX)>0){
                  this.count--;
                  if(this.count<0){
                    this.count =this.banners.length-1;
                  }
                }else{
                  this.count++;
                  if(this.count>(this.banners.length-1)){
                    this.count = 0;
                  }
                }
                this.runBanner(this.count)
              }
            }
          },
          getList(list){ // 获取播放列表
            list.forEach((ele)=>{
              this.playlist.push(...ele.resources);
            })
            sessionStorage.setItem('playlist',JSON.stringify(this.playlist))
          },
          playSong(song){//播放歌曲
              this.playlist = [];
              this.getList(this.selectedRcmdSong.creatives)
            if(!song){
              this.getPlayList({song:this.playlist[0],playlist:this.playlist,playIndex:-1});
            }else{
              this.getPlayList({song:song,playlist:this.playlist,playIndex:-1});
            }
            this.openCloseList({isPage:true,isList: true});
          },
          openCloseSheet(sheetId){
              this.openSheet(true);
//            this.openAllSheets(true);
              this.getSheetSong({sheetId:sheetId,sheetList:null}); //creativeId
          },
          goSwitch(index,sign){
            this.newsNumSong = [];
            $('.navs span').eq(index).css('color','#000');
            $('.navs span').eq(index).siblings().css('color','#888');
            this.songSign = sign;
            this.newSong.forEach((item,index)=>{
              if(this.songSign == item.uiElement.mainTitle.title){
                this.newsNumSong.push(item)
              }
            })
            this.$nextTick(()=>{
              if(this.objIsNull(this.newSong)){
                if(!this.newBs){
                  this.newBs = new BScroll('.songDieNum',{momentum: true,observeDOM: false,scrollX:true, click: true})
                }else{
                  this.newBs.refresh()
                }
                this.newBs.scrollTo(0)
              }
              if(this.objIsNull(this.extend)){
                if(!this.exBs){
                  this.exBs = new BScroll('.extendsong',{momentum: true,observeDOM: false,scrollX:true, click: true})
                }else{
                  this.exBs.refresh()
                }
              }
            })
          },
          playNewsSongs(item,sign){
              let arr = [];
              if(sign == '新歌'){
                this.playlist = [];
                this.getList(this.newsNumSong)
                if(!item){
                  this.getPlayList({song:this.playlist[0],playlist:this.playlist,playIndex:-1});
                }else{
                  this.getPlayList({song:item,playlist:this.playlist,playIndex:-1});
                }
                this.openCloseList({isPage:true,isList: true});
              }
              if(sign == '新碟'){
                this.openCloseSheet(item.resourceId)
              }
              if(sign == '数字专辑'){}
              if(sign == '推广'){
                this.playlist = [];
                this.getList(this.extend.creatives)
                if(!item){
                  this.getPlayList({song:this.playlist[0],playlist:this.playlist,playIndex:-1});
                }else{
                  this.getPlayList({song:item,playlist:this.playlist,playIndex:-1});
                }
                this.openCloseList({isPage:true,isList: true});
              }
          },
          isRufreshPage(){
              this.getMyFound();
              location.reload();
              this.$nextTick(()=>{
                this.allBs.scrollTo(0,0);
              })
          },
          openAllSheet(tip){
            this.changeActiveTip(tip);
            this.openMoreSheet(true);
          },
          switchRa(index){
            $('.htitle span').eq(index).css('color','#000');
            $('.htitle span').eq(index).siblings().css('color','#aaa');
            this.radioSetData = this.h24Podcast[index];
          },
          getVdieoUrls(item,index,sign){
              let reg = /^\d+(,\d+)*$/;
              let url = '';

              if(reg.test(item.id)){
                axios.get(`https://my-wyy.vercel.app/mv/url?id=${item.id}&realIP=116.25.146.177`).then(res=>{
                  if(res.data.code == '200'){
                    url = res.data.data.url;
                    this.playVideo(index,sign,url)
                  }
                })
              }else{
                axios.get(`https://my-wyy.vercel.app/mlog/to/video?id=${item.id}&realIP=116.25.146.177`).then(res=>{
                  if(res.data.code == '200'){
                    return res.data.data;
                  }
                }).then(vid=>{
                  if(vid){
                    axios.get(`https://my-wyy.vercel.app/video/url?id=${vid}&realIP=116.25.146.177`).then(res=>{
                      if(res.data.code == '200'){
                        url = res.data.urls[0].url;
                        this.playVideo(index,sign,url)
                      }
                    })
                  }
                })
              }
          },
          playVideo(index,sign,url){
              if(sign == 'play'){
                $('.video').eq(index).attr('src',url);
                $('.selectVideo .videocontent>ul>li p.p1>video').eq(index)[0].play();
                $('.selectVideo .videocontent>ul>li p.p1>img').eq(index).css('display','none')
                $('.selectVideo .videocontent>ul>li p.p1>video').eq(index).css('display','block');
                $('.selectVideo .videocontent>ul>li').eq(index).siblings().children('p.p1').children('.img').css('display','block');
                $('.selectVideo .videocontent>ul>li').eq(index).siblings().children('p.p1').children('.video').attr('src','');
                $('.pla').eq(index).css('display','none');
                $('.sto').eq(index).css('display','inline-block');
                $('.selectVideo .videocontent>ul>li').eq(index).siblings().children('p.p1').children('.pla').css('display','inline-block')
                $('.selectVideo .videocontent>ul>li').eq(index).siblings().children('p.p1').children('.sto').css('display','none')
              }
              if(sign == 'pause'){
                $('.selectVideo .videocontent>ul>li p.p1>video').eq(index)[0].pause();
                $('.pla').eq(index).css('display','block');
                $('.sto').eq(index).css('display','none');
              }
          },
          arletTip(){
            this.$notify({
              title: '警告',
              message: '功能尚未完善',
              type: 'warning',
              position: 'top-right',
              duration: 2000
            });
          },
          videoEvent(video){
            video.addEventListener('loadstart', function(e) {
              console.log('提示视频的元数据已加载')
              console.log(e)
              console.log(video.duration)            // NaN
            })

            // 2、durationchange：时长变化。当指定的音频/视频的时长数据发生变化时触发，加载后，时长由 NaN 变为音频/视频的实际时长
            video.addEventListener('durationchange', function(e) {
              console.log('提示视频的时长已改变')
              console.log(e)
              console.log(video.duration)           // 528.981333   视频的实际时长（单位：秒）
            })

            // 3、loadedmetadata ：元数据加载。当指定的音频/视频的元数据已加载时触发，元数据包括：时长、尺寸（仅视频）以及文本轨道
            video.addEventListener('loadedmetadata', function(e) {
              console.log('提示视频的元数据已加载')
              console.log(e)
            })

            // 4、loadeddata：视频下载监听。当当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧时触发
            video.addEventListener('loadeddata', function(e) {
              console.log('提示当前帧的数据是可用的')
              console.log(e)
            })

            // 5、progress：浏览器下载监听。当浏览器正在下载指定的音频/视频时触发
            video.addEventListener('progress', function(e) {
              console.log('提示视频正在下载中')
              console.log(e)
            })

            // 6、canplay：可播放监听。当浏览器能够开始播放指定的音频/视频时触发
            video.addEventListener('canplay', function(e) {
              console.log('提示该视频已准备好开始播放')
              console.log(e)
            })

            // 7、canplaythrough：可流畅播放。当浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时触发
            video.addEventListener('canplaythrough', function(e) {
              console.log('提示视频能够不停顿地一直播放')
              console.log(e)
            })

            // 8、play：播放监听
            video.addEventListener('play', function(e) {
              console.log('提示该视频正在播放中')
              console.log(e)
            })

            // 9、pause：暂停监听
            video.addEventListener('pause', function(e) {
              console.log('暂停播放')
              console.log(e)
            })

            // 10、seeking：查找开始。当用户开始移动/跳跃到音频/视频中新的位置时触发
            video.addEventListener('seeking', function(e) {
              console.log('开始移动进度条')
              console.log(e)
            })

            // 11、seeked：查找结束。当用户已经移动/跳跃到视频中新的位置时触发
            video.addEventListener('seeked', function(e) {
              console.log('进度条已经移动到了新的位置')
              console.log(e)
            })

            // 12、waiting：视频加载等待。当视频由于需要缓冲下一帧而停止，等待时触发
            video.addEventListener('waiting', function(e) {
              console.log('视频加载等待')
              console.log(e)
            })

            // 13、playing：当视频在已因缓冲而暂停或停止后已就绪时触发
            video.addEventListener('playing', function(e) {
              console.log('playing')
              console.log(e)
            })

            // 14、timeupdate：目前的播放位置已更改时，播放时间更新
            video.addEventListener('timeupdate', function(e) {
              console.log('timeupdate')
              console.log(e)
            })

            // 15、ended：播放结束
            video.addEventListener('ended', function(e) {
              console.log('视频播放完了')
              console.log(e)
            })

            // 16、error：播放错误
            video.addEventListener('error', function(e) {
              console.log('视频出错了')
              console.log(e)
            })

            // 17、volumechange：当音量更改时
            video.addEventListener('volumechange', function(e) {
              console.log('volumechange')
              console.log(e)
            })

            // 18、stalled：当浏览器尝试获取媒体数据，但数据不可用时
            video.addEventListener('stalled', function(e) {
              console.log('stalled')
              console.log(e)
            })

            // 19、ratechange：当视频的播放速度已更改时
            video.addEventListener('ratechange', function(e) {
              console.log('ratechange')
              console.log(e)
            })
          },
          antiShake(fn,delay){
              let _this = this;
            _this.preventTimer = null;
               return (function(){
                 clearTimeout(_this.preventTimer);
                 _this.preventTimer = setTimeout(()=>{
                   fn.apply(this,arguments)
                 },delay)
               })()
          }
        },
      computed:{
        ...mapState({
          isPlayList:'isPlayList',
          isPlayPage:'isPlayPage',
          isOpenSheet:'isOpenSheet',
        }),
        computedTime(){
            let date = new Date();
            let day = date.getDate();
          let date2 = new Date(this.musicCalendar.creatives[1].resources[0].resourceExtInfo.startTime);
          let day2 = date2.getDate();
          let d = day2-day;
          if(d===1){return '明天'}
          if(d===2){return '后天'}
        },
        cutLongStr(){
            if(this.musicCalendar.creatives[0].resources[0].uiElement.labelTexts[0]){
              return this.musicCalendar.creatives[0].resources[0].uiElement.labelTexts[0];
            }
        },
        cutLongStr0(){
          return this.musicCalendar.creatives[0].resources[0].uiElement.mainTitle.title;
        },
        cutLongStr1(){
          return this.musicCalendar.creatives[1].resources[0].uiElement.mainTitle.title;
        },
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
      watch:{
        allScrollY(news,old){
            if(news === this.maxScrollY && this.runCount !==6){
                new Promise((resolve,reject)=>{
                    if(!this.isVd){
                      this.isVd = true;
                      if(this.objIsNull(this.selectedMVideo)){
                        this.$nextTick(()=>{
//                          this.playVdieo(this.selectedMVideo.extInfo[0],0)
                          if(!this.vdBs){
                            this.vdBs = new BScroll('.videocontent',{bounce:false,momentum: true,observeDOM: false,scrollX:true,probeType:3, click: true })
                            this.vdBs.on('scroll',(e)=>{
                              this.vdBsMaxScrollX = this.vdBs.maxScrollX;
                              this.vdBsScrollX = e.x;
                            })
                          }
                          this.getVdieoUrls(this.selectedMVideo.extInfo[0],0,'play')
                        })
                      }
                    }else{
                      resolve(this.isRa);
                      this.runCount++;
                    }
                }).then(res=>{
                    if(!res && this.runCount === 1){
                      this.isRa = true;
                      if(this.objIsNull(this.radarList)){
                        this.$nextTick(()=>{
                          this.raBs = new BScroll('.radarcontent',{momentum: true,observeDOM: false,scrollX:true, click: true})
                        })
                      }
                    }else{
                        if(this.runCount ===2){
                          return this.isHot;
                        }
                    }

                }).then(res=>{
                    if(!res && this.runCount ===2){
                      this.isHot = true;
                      if(this.objIsNull(this.hotPodcast)){
                        this.$nextTick(()=>{
                          this.hotBs = new BScroll('.hotcontent',{momentum: true,observeDOM: false,scrollX:true, click: true})
                        })
                      }else{
                          if(this.runCount ===3){
                            return this.isScene
                          }
                      }
                    }
                }).then(res=>{
                    if(!res && this.runCount ===3){
                      this.isScene = true;
                      if(this.objIsNull(this.sceneList)){
                        this.$nextTick(()=>{
                          this.sceneBs = new BScroll('.scenecontent',{momentum: true,observeDOM: false,scrollX:true, click: true})
                        })
                      }
                    }else{
                      if(this.runCount ===4){
                        return this.isNews
                      }
                    }
                }).then(res=>{
                    if(!res && this.runCount ===4){
                      this.isNews = true;
                      $('.navs span').eq(0).css('color','#000');
                      this.goSwitch(0,'新歌');
                    }else{
                      if(this.runCount ===5){
                        return this.is24h
                      }
                    }
                }).then(res=>{
                    if(!res && this.runCount ===5){
                      this.is24h = true;
                      if(this.objIsNull(this.h24Podcast)){
                        this.$nextTick(()=>{
                          this.h24Bs = new BScroll('.h24Content',{momentum: true,observeDOM: false,scrollX:true, click: true})
                        })
                      }
                    }else{
                      if(this.runCount ===6){
                        return this.isVideo;
                      }
                    }
                }).then(res=>{
                    if(!res && this.runCount ===6){
                      this.isLoadingOther = false;
                      this.isVideo = true;
                      if(this.objIsNull(this.videoCollection)){
                        this.$nextTick(()=>{
                          this.vdcBs = new BScroll('.videoContent',{momentum: true,observeDOM: false,scrollX:true, click: true})
                        })
                      }
                    }
                })
            }
        },
        vdBsScrollX(news,old){
          if(Math.floor(news) <= (0)&& Math.floor(news) > (-90)){
              if(!this.firstV){
                this.getVdieoUrls(this.selectedMVideo.extInfo[0],0,'play')
                this.firstV = true;
                this.secondV = false;
                this.thridV = false;
                this.fourthV = false;
              }
          }
            if(Math.floor(news) <= (-90)&& Math.floor(news) > (-190)){
              if(!this.secondV){
                this.getVdieoUrls(this.selectedMVideo.extInfo[1],1,'play')
                this.firstV = false;
                this.secondV = true;
                this.thridV = false;
                this.fourthV = false;
              }
            }
          if(Math.floor(news) <= (-190)&& Math.floor(news) > (-290)){
            if(!this.thridV){
              this.getVdieoUrls(this.selectedMVideo.extInfo[2],2,'play')
              this.firstV = false;
              this.secondV = false;
              this.thridV = true;
              this.fourthV = false;
            }
          }
          if(Math.floor(news) <= (-290)&& Math.floor(news) > (-390)){
            if(!this.fourthV){
              this.getVdieoUrls(this.selectedMVideo.extInfo[3],3,'play')
              this.firstV = false;
              this.secondV = false;
              this.thridV = false;
              this.fourthV = true;
            }
          }
        },
      },
      updated(){
            if(this.loading){
                if(!this.timer){
                  this.runBanner();
                }
              this.$nextTick(()=>{
                if(sessionStorage.getItem('myFoundData')){
                  if(!this.allBs){this.allBs = new BScroll('.wrapper',{scrollY:true,bounce:false,click:false,probeType:3})}else{this.allBs.refresh()}
                  if(this.allBs && (this.maxScrollY === 0)){
                    this.allBs.on('scroll',(e)=>{
                      this.maxScrollY = this.allBs.maxScrollY;
                      this.allScrollY = e.y;
                    })
                  }
                }
                if(this.objIsNull(this.rcmdList)){
                  if(!this.recBs){this.recBs = new BScroll('.recontent',{momentum: true,observeDOM: false,scrollX:true, click: true})}else{this.recBs.refresh()}
                }
                if(this.objIsNull(this.selectedRcmdSong)){
                  if(!this.selBs){this.selBs = new BScroll('.selSongContent',{momentum: true,observeDOM: false,scrollX:true, click: true })}else{this.selBs.refresh()}
                }
              })
            }
      },
      mounted(){
        if(this.loading){
          if(!this.timer){
            this.runBanner();
          }
          this.$nextTick(()=>{
            if(sessionStorage.getItem('myFoundData')){
              if(!this.allBs){this.allBs = new BScroll('.wrapper',{scrollY:true,bounce:false,click:false,probeType:3})}else{this.allBs.refresh()}
              if(this.allBs && (this.maxScrollY === 0)){
                this.allBs.on('scroll',(e)=>{
                  this.maxScrollY = this.allBs.maxScrollY;
                  this.allScrollY = e.y;
                })
              }
            }
            if(this.objIsNull(this.rcmdList)){
              if(!this.recBs){this.recBs = new BScroll('.recontent',{momentum: true,observeDOM: false,scrollX:true, click: true})}else{this.recBs.refresh()}
            }
            if(this.objIsNull(this.selectedRcmdSong)){
              if(!this.selBs){this.selBs = new BScroll('.selSongContent',{momentum: true,observeDOM: false,scrollX:true, click: true })}else{this.selBs.refresh()}
            }
          })
        }
      },
      created(){
        if(sessionStorage.getItem('myFoundData')){
                  JSON.parse(sessionStorage.getItem('myFoundData')).forEach(ele=>{
          if(ele.blockCode=="HOMEPAGE_BANNER"){this.banners = ele.extInfo.banners}
          if(ele.blockCode=="HOMEPAGE_BLOCK_PLAYLIST_RCMD"){this.rcmdList = ele.creatives}
          if(ele.blockCode=="HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG"){this.newSong =ele.creatives}
          if(ele.blockCode=="HOMEPAGE_YUNBEI_NEW_SONG"){this.extend = ele}
          if(ele.blockCode=="HOMEPAGE_MUSIC_MLOG"){this.selectedMVideo = ele}
          if(ele.blockCode=="HOMEPAGE_BLOCK_STYLE_RCMD"){this.selectedRcmdSong = ele}
          if(ele.blockCode=="HOMEPAGE_MUSIC_CALENDAR"){this.musicCalendar = ele}
          if(ele.blockCode=="HOMEPAGE_BLOCK_MGC_PLAYLIST"){this.radarList = ele}
          if(ele.blockCode=="HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST"){this.sceneList = ele}
          if(ele.blockCode=="HOMEPAGE_VOICELIST_RCMD"){this.hotPodcast = ele}
          if(ele.blockCode=="HOMEPAGE_PODCAST24"){this.h24Podcast = ele.creatives}
          if(ele.blockCode=="HOMEPAGE_BLOCK_VIDEO_PLAYLIST"){this.videoCollection = ele}
        })
          if(this.selectedRcmdSong){
            this.selectTitle = this.selectedRcmdSong.uiElement.subTitle.title;
            this.getList(this.selectedRcmdSong.creatives)
          }
          if(this.h24Podcast){
            this.radioSetData = this.h24Podcast[0];
          }
        }else{
            this.getMyFound()
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
    margin:0;
    padding:0;
  }
  .clearfix:after{
    content: '';
    display: block;
    clear: both;
    overflow: hidden;
  }
  .wrapper{
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #eee;
    overflow: hidden;
    font-size: 10px
  }
  .loading{
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .loading img{
    position: absolute;
    top: 30%;
    left: 50%;
    width: 266.8px;
    height: 150px;
    margin-left: -133.4px;
    margin-top: -75px;
  }
  .myfound{
    padding-bottom: 15em;
  }
  .bar{
    position: relative;
    padding: 1em 0;
    width: 100%;;
    height: 12em;
    background: #fff;
  }
  .bar>ul{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
  .bar>ul>li{
    margin: .1em;
    display: inline-block;
    width: 1em;
    height: .2em;
    background: #aaa;
    border-radius: .1em;
  }
  .bar>.banner{
    position: absolute;
    left: 50%;
    margin-left: -16em;
    width: 32em;
    height: 12em;
    overflow: hidden;
    border-radius: 1.5em;
  }
  .bar>.banner ul{
    width: 384em;
    list-style-type: none;
    border-radius: 1.5em;
  }
  .bar>.banner ul li{
    float: left;
    width: 32em;
    height: 12em;
    border-radius: 1.5em;
  }
  .bar>.banner ul li img{
    width: 100%;
    height: 100%;
    border-radius: 1.5em;
  }
  .otherFn{
    padding-top: 2em;
    background: #fff;
  }
  .otherFn>ul{
    display: flex;
    justify-content: space-around;
    align-items: center;
    list-style-type: none;
  }
  .otherFn>ul>li>i{
    font-size: 2.5em;
    color: #dc2c1f;
    border: .4em solid rgba(220, 44, 31, 0.1);
    border-radius: 50%;
  }
  .otherFn>ul>li>p{
    padding: 1em 0;
    font-size: 1.4em;
  }
  .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.6em 1.4em;
    background: #fff;
  }
  .title p{
    padding: .1em .6em;
    border: 1px solid #ccc;
    border-radius: 1.5em;
    text-align: center;
  }
  .title p span{
    display: inline-block;
    margin-left: .2em;
    font-size: 1.3em;
    line-height: 1.3em;
  }
  .title p i{
    font-size: 1.2em;
    line-height: 1.2em;
  }
  .RecSonglist .recontent{
    padding: 0 .7em 1em .7em;
    background: #fff;
    border-bottom-left-radius: 1.5em;
    border-bottom-right-radius: 1.5em;
    overflow: hidden;
  }
  .RecSonglist .recontent .recul{
    display: inline-block;
    list-style-type: none;
    width: 66em;
    height: 13.5em;
    text-align: left;
  }
  .RecSonglist .recontent .recul li{
    display: inline-block;
    padding: 0 .5em 1.6em .5em;
    width: 10em;
    height: 13.5em;
    vertical-align: top;
  }
  .RecSonglist .recontent .recul li p.img{
    position: relative;
  }
  .RecSonglist .recontent .recul li p.img span{
    position: absolute;
    top: .5em;
    right: .5em;
    display: inline-block;
    padding: .2em .3em;
    background: rgba(0,0,0,.4);
    border-radius: 1.5em;
    color: #fff;
  }
  .RecSonglist .recontent .recul li p.img span i{
    font-size: 1.2em;
  }
  .RecSonglist .recontent .recul li p.img img{
    width: 10em;
    height: 10em;
    border-radius: 1.5em;
  }
  .RecSonglist .recontent .recul li p.text{
    max-height: 3.0em;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;      /* 可以显示的行数，超出部分用...表示*/
    -webkit-box-orient: vertical;
    font-size: 1.2em;
  }
  .RecSonglist .recontent .recul li p.text span.reason{
    display: inline-block;
    padding: 0 .1em;
    border: 1px solid #888;
    color: #888;
    font-size: .9em;
    border-radius: .5em;
  }
  .borderRadius{
    border-top-left-radius: 1.5em;
    border-top-right-radius: 1.5em;
  }
  .selectedRcmdSong{
    margin-top: 1em;
  }
  .selectedRcmdSong .selSongContent{
    background: #fff;
    border-bottom-left-radius: 1.5em;
    border-bottom-right-radius: 1.5em;
  }
  .selectedRcmdSong .selSongContent .selSongul{
    display: inline-block;
    list-style-type: none;
    text-align: left;
    width: 140em;
  }
  .selectedRcmdSong .selSongContent .selSongul>li{
    display: inline-block;
    margin-bottom: 1.6em;
    width: 35em;
    list-style-type: none;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul{
    margin-right: 1em;
    list-style-type: none;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul .link{
    margin: 0 0 1.4em 7.4em;
    width: 26em;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul li{
    margin: 0 1.4em;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul li div.img{
    width:5em;
    height: 5em;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul li div.img img{
    width:5em;
    height: 5em;
    border-radius: .8em;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul li div.songname{
    margin: 0 1em;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul li div.songname p.p1{
    width: 22em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul li div.songname p.p1 span.span1{
    font-size: 1.5em;
    color: #000;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul li div.songname p.p1 span.span2{
    font-size: 1.2em;
    color: #888;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul li div.songname p.p2 span{
    font-size: 1.2em;
    color: #888;
  }
  .selectedRcmdSong .selSongContent .selSongul>li ul li div.videoico i{
    color: #aaa;
    font-size: 1.8em;
  }
  .selectVideo{
    margin-top: 1em;
    background: #fff;
    border-radius: 1.5em;
  }
  .selectVideo .videocontent>ul{
    display: flex;
    list-style-type: none;
    width: 60em;
    text-align: left;
  }
  .selectVideo .videocontent>ul>li{
    margin: 0 .5em;
    padding-bottom:1.6em;
    width: 10em;
    height: 15em;
  }
  .selectVideo .videocontent>ul>li p.p1{
    position: relative;
    width: 10em;
    height: 12em;
    overflow: hidden;
    border-radius: 1.2em;
  }
  .selectVideo .videocontent>ul>li p.p1 img{
    height: 300%;
    width: 300%;
    margin-left: -100%;
    margin-top: -100%;
  }
  .selectVideo .videocontent>ul>li p.p1>video{
    height: 300%;
    width: 300%;
    margin-left: -100%;
    margin-top: -100%;
  }
  .selectVideo .videocontent>ul>li p.p1 .playStop{
    position: absolute;
    right: 6%;
    bottom: 6%;
    font-size: 2.4em;
    color: #fff;
  }
  .selectVideo .videocontent>ul>li p.p1 span{
    position: absolute;
    top: .5em;
    right: .5em;
    display: inline-block;
    padding: .2em .3em;
    background: rgba(0,0,0,.4);
    border-radius: 1.5em;
    color: #fff;
  }
  .selectVideo .videocontent>ul>li p.p1 span i{
    font-size: 1.2em;
  }
  .selectVideo .videocontent>ul>li p.p2{
    margin-top: .2em;
    max-height: 3.0em;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;      /* 可以显示的行数，超出部分用...表示*/
    -webkit-box-orient: vertical;
    font-size: 1.2em;
  }
  .radar ,.hot ,.scene, .videoCol{
    margin-top: 1em;
  }
  .newSong{
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .newSong .navs span{
    font-size: 1.5em;
    font-weight: 600;
    color: #888;
  }
  .newSong .songDieNum{
    background: #fff;
  }
  .newSong .songDieNum .selSongul{
    display: inline-block;
    list-style-type: none;
    text-align: left;
    white-space: nowrap;
    background: #fff;
  }
  .newSong .songDieNum .selSongul>li{
    display: inline-block;
    margin-bottom: 1.6em;
    width: 35em;
    list-style-type: none;
    background: #fff;
  }
  .newSong .songDieNum .selSongul>li ul{
    margin-right: 1em;
    list-style-type: none;
  }
  .newSong .songDieNum .selSongul>li ul .link{
    margin: 0 0 1.4em 7.4em;
    width: 26em;
  }
  .newSong .songDieNum .selSongul>li ul li{
    margin: 0 1.4em;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .newSong .songDieNum .selSongul>li ul li div.img{
    width:5em;
    height: 5em;
  }
  .newSong .songDieNum .selSongul>li ul li div.img img{
    width:5em;
    height: 5em;
    border-radius: .8em;
  }
  .newSong .songDieNum .selSongul>li ul li div.songname{
    margin: 0 1em;
  }
  .newSong .songDieNum .selSongul>li ul li div.songname p.p1{
    width: 22em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .newSong .songDieNum .selSongul>li ul li div.songname p.p1 span.span1{
    font-size: 1.5em;
    color: #000;
  }
  .newSong .songDieNum .selSongul>li ul li div.songname p.p1 span.span2{
    font-size: 1.2em;
    color: #888;
  }
  .newSong .songDieNum .selSongul>li ul li div.songname p.p2{
    width: 22em;
    color: #888;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .newSong .songDieNum .selSongul>li ul li div.songname p.p2 span{
    font-size: 1.2em;
  }
  .newSong .songDieNum .selSongul>li ul li div.videoico i{
    color: #aaa;
    font-size: 1.8em;
  }
  .extend{
    background: #fff;
    text-align: left;
    border-bottom-left-radius: 1.5em;
    border-bottom-right-radius: 1.5em;
  }
  .extend .extendtitle{
    padding: 1.4em;
  }
  .extend .extendsong{
    background: #fff;
    overflow: hidden;
    border-bottom-left-radius: 1.5em;
    border-bottom-right-radius: 1.5em;
  }
  .extend .extendsong ul{
    list-style-type: none;
    width: 105em;
    text-align: left;
  }
  .extend .extendsong ul li{
    margin-bottom: 1.6em;
    display: inline-block;
    width: 35em;
  }
  .extend .extendsong ul li div.extendcontent{
    margin: 0 1.4em;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .extend .extendsong ul li div.img{
    width:5em;
    height: 5em;
  }
  .extend .extendsong ul li div.img img{
    width:5em;
    height: 5em;
    border-radius: .8em;
  }
  .extend .extendsong ul li div.songname{
    margin: 0 1em;
  }
  .extend .extendsong ul li div.songname p.p1{
    width: 22em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .extend .extendsong ul li div.songname p.p1 span.span1{
    font-size: 1.5em;
    color: #000;
  }
  .extend .extendsong ul li div.songname p.p1 span.span2{
    font-size: 1.2em;
    color: #888;
  }
  .extend .extendsong ul li div.songname p.p2{
    width: 22em;
    color: #888;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .extend .extendsong ul li div.songname p.p2 span{
    font-size: 1.2em;
  }
  .extend .extendsong ul li div.videoico i{
    color: #aaa;
    font-size: 1.8em;
  }
  .musicCal{
    margin-top: 1em;
    background: #fff;
    border-radius: 1.5em;

  }
  .musicCal .luck{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 1.4em;
    padding: 1.2em 1em;
    border: 1px solid #eee;
    border-radius: 1em;
  }
  .musicCal .luck .text{
    font-size: 1.4em;
  }
  .musicCal .luck .btn span{
    vertical-align: middle;
  }
  .musicCal .luck .btn i{
    vertical-align: middle;
    font-size: 1em;
    margin: 0 .1em;
  }
  .musicCal .calContent{
    margin: 1.4em;
    padding-bottom: 1.6em;
    border-bottom-left-radius: 1.5em;
    border-bottom-right-radius: 1.5em;
  }
  .musicCal .calContent .today,  .musicCal .calContent .tomorrer{
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;
  }
  .musicCal .calContent .today{
    margin-bottom: 1em;
  }
  .musicCal .calContent .people{
    text-align: center;
  }
  .musicCal .calContent .today .txt{
    width: 70%;
  }
  .musicCal .calContent .tomorrer .txt{
    width: 70%;
  }
  .musicCal .calContent .today .txt p.p2,  .musicCal .calContent .tomorrer .txt p.p2{
    font-size: 1.4em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .musicCal .calContent .today .img img,  .musicCal .calContent .tomorrer .img img{
    width: 5em;
    height: 5em;
    border-radius: 1em;
  }
  .musicCal .calContent .today .txt p span.sp1{
    font-size: 1.4em;
    vertical-align: middle;
    color: #777;
  }
  .musicCal .calContent .today .txt p span.sp2{
    display: inline-block;
    margin-left: .2em;
    border: .5em solid #fffcf7;
    color: #edb635;
    border-radius: .4em;
    background: #fffcf7;
    font-size: 1.2em;
    vertical-align: middle;
  }
  .musicCal .calContent .tomorrer .txt p span.sp1{
    font-size: 1.4em;
    vertical-align: middle;
    color: #777;
  }
  .musicCal .calContent .tomorrer .txt p span.sp2{
    display: inline-block;
    margin-left: .2em;
    border: .4em solid #f2f2f2;
    background: #f2f2f2;
    color: #828282;
    border-radius: .5em;
    font-size: 1.2em;
    vertical-align: middle;
  }
  .h24 .recontent .recul li p.h24img{
    position: relative;
    top: 0;
    left: 0;
  }
  .h24 .recontent .recul li p.h24img img{
    border-radius: 50%;
  }
  .h24 .recontent .recul li p.h24text{
    text-align: center;
  }
  .h24 .recontent .recul li p.h24img span.play{
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    height: 10em;
    width: 10em;
    background: rgba(0,0,0,.5);
    display: inline-block;
    border-radius: 50%;
  }
  .h24 .recontent .recul li p.h24img span.play i{
    position: absolute;
    top:50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -20px;
    font-size: 4em;
    border-radius: 50%;
  }
  .rufreshbtn{
    margin-top: 1em;
  }
  .rufreshbtn .btn{
    padding: 2em 0;
    background: #fff;
    text-align: center;
    border-radius: 1.5em;
  }
  .rufreshbtn .btn i{
    margin-right: .2em;
    vertical-align: middle;
  }
  .rufreshbtn .btn span{
    vertical-align: middle;
  }
  .rufreshbtn .btn .span2{
    display: inline-block;
    color: #aaa;
    margin-left: 1em;
  }
</style>
