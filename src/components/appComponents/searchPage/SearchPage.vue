<template>
    <div class="search">
      <div class="goSearch" v-if="!isShowSearchList">
        <div class="back"><i class="iconfont icon-icon-test1" @click="isOpenSearch(false)"></i></div>
        <div class="input">
          <input type="text" v-model="inputContent" :placeholder="searchContent" autofocus="autofocus" @keydown.enter="goToSearch(inputContent,activeId)">
           <i class="del iconfont icon-guanbi" v-if="inputContent" @click="delContents"></i>
        </div>
      </div>
      <div class="goSearch" v-if="isShowSearchList">
        <div class="back"><i class="iconfont icon-icon-test1" @click="delContents"></i></div>
        <div class="input">
          <input type="text" v-model="inputContent" :placeholder="searchContent" autofocus="autofocus" @keydown.enter="goToSearch(inputContent,activeId)">
          <i class="del iconfont icon-guanbi" v-if="inputContent" @click="delContents"></i>
        </div>
      </div>
      <div class="suggestList" v-if="isShowSuggest && inputContent !== ''">
        <ul v-if="suggestData.allMatch">
          <li v-for="(item,index) in suggestData.allMatch" :key="index" @click="goToSearch(item.keyword,activeId)">
            <p class="iconp"><i class="iconfont icon-sousuo"></i></p>
            <p class="textp">
              <span>{{item.keyword}}</span>
              <el-divider></el-divider>
            </p>
          </li>
        </ul>
        <ul>
          <li @click="goToSearch(inputContent,activeId)">
            <p class="iconp"><i class="iconfont icon-sousuo"></i></p>
            <p class="textp">
              <span>搜索“{{inputContent}}”</span>
              <el-divider></el-divider>
            </p>
          </li>
        </ul>
      </div>
      <div class="defaultlist" v-if="!inputContent">
        <div class="searchtitle">
          <h2>热搜榜</h2>
          <p>
            <i class="iconfont icon-play"></i><span>播放</span>
          </p>
        </div>
        <div class="bangcontent" v-if="!isBangLoading">
          <ul>
            <li v-for="(item,index) in bangData" :key="index" @click="goToSearch(item.searchWord,activeId)">
              <span class="number">{{index+1}}</span><span class="keywords">{{item.searchWord}}</span><img v-if="item.iconUrl" :src="item.iconUrl" :style="item.iconType==5?'width:8%;height:8%;':''" alt="">
            </li>
          </ul>
        </div>
        <div class="showError"  v-loading="isBangLoading"></div>
      </div>
      <div class="searchData" v-if="isShowSearchList">
        <div class="searchContents">
          <div class="searchtip">
            <ul class="content">
              <li class="searchlis" v-for="(item,index) in searchType" :key="index" @click="chooseClick(index,item.tipName,inputContent,item.typeId)">
                <span class="typename">{{item.typeName}}</span>
                <span class="bottomline" :ref="`line${index}`"></span>
              </li>
            </ul>
          </div>
          <div class="allSearch" v-if="!isLoading">
            <ul style=" padding-bottom: 16em;">
              <li class="comprecontent" v-if="activeTip == 'compre'">
                <div class="searchsong clearfix" v-if="searchData.song">
                  <div class="searchtitle">
                    <h2>单曲</h2>
                    <p>
                      <i class="iconfont icon-play"></i><span>播放</span>
                    </p>
                  </div>
                  <ul class="comprelis" v-for="(item ,index) in searchData.song.songs" :key="index">
                    <el-divider></el-divider>
                    <li>
                      <p class="p1" @click="playSong(item)">
                        <span class="sp1">{{item.name}}</span>
                        <span class="sp2"><i class="iconfont icon-VIP" v-if="item.fee === 1" style="color: red;"></i><span>{{item.ar[0].name}}-{{item.al.name}}</span></span>
                      </p>
                      <p class="p2"><i class="iconfont icon-shipin"></i><i class="iconfont icon-yuandiancaidan" @click="openSongDetail(item)"></i></p>
                    </li>
                  </ul>
                    <div class="bottombtn">
                      <el-divider></el-divider>
                      <p v-if="searchData.song.moreText">
                        <span>{{searchData.song.moreText}}</span><i class="iconfont icon-xiangyou"></i>
                      </p>
                    </div>
                </div>
                <div class="searchsheet" v-if="searchData.playList">
                  <div class="searchtitle">
                    <h2>歌单</h2>
                  </div>
                    <div class="someSheet" v-for="(item,index) in searchData.playList.playLists" :key="index" @click="openSheets(item.id)">
                      <div class="img"><img :src="item.coverImgUrl" alt=""></div>
                      <div class="someInform">
                        <p class="sheetName"><span>{{item.name}}</span></p>
                        <p class="informs"><span>{{item.trackCount}}首</span> , <span>by{{item.creator.nickname}}</span> , <span>播放{{item.playCount | playCounts(item.playCount)}}次</span></p>
                        <p class="signs"><span v-for="(item2,index2) in item.officialTags" :key="index2">{{item2}}</span></p>
                      </div>
                    </div>
                  <div class="bottombtn">
                    <el-divider></el-divider>
                    <p v-if="searchData.playList.moreText">
                      <span>{{searchData.playList.moreText}}</span><i class="iconfont icon-xiangyou"></i>
                    </p>
                  </div>
                </div>
                <div class="searchyiren" v-if="searchData.artist">
                  <div class="searchtitle">
                    <h2>艺人</h2>
                  </div>
                  <div class="singercontent yirenInform">
                    <ul class="singerUl" v-for="(item ,index) in searchData.artist.artists" :key="index">
                      <li>
                        <p class="p1">
                          <img v-lazy="item.picUrl" alt="">
                          <span>{{item.name}}</span><span class="trans" v-if="item.trans">({{item.trans}})</span>
                        </p>
                        <p class="p2">
                          <span>+ 关注</span>
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div class="bottombtn">
                    <el-divider></el-divider>
                    <p v-if="searchData.artist.moreText">
                      <span>{{searchData.artist.moreText}}</span><i class="iconfont icon-xiangyou"></i>
                    </p>
                  </div>
                </div>
                <div class="albumcontent searchcomprealbum" v-if="searchData.album">
                  <div class="searchtitle">
                    <h2>专辑</h2>
                  </div>
                  <div class="searchalbum">
                    <ul v-for="(item,index) in searchData.album.albums" :key="index">
                      <li >
                        <div class="alimg"><img v-lazy="item.picUrl" alt=""></div>
                        <div class="alinform">
                          <p class="p1">{{item.name}}</p>
                          <p class="p2"><span>{{item.artist.name}}</span><span v-if="item.containedSong">包含单曲：{{item.containedSong}}</span><span v-if="!item.containedSong">{{item.publishTime | getPublishTime(item.publishTime)}}</span></p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="bottombtn">
                    <el-divider></el-divider>
                    <p v-if="searchData.album.moreText">
                      <span>{{searchData.album.moreText}}</span><i class="iconfont icon-xiangyou"></i>
                    </p>
                  </div>
                </div>
                <div class="usercontent compreuser" v-if="searchData.user">
                  <div class="searchtitle">
                    <h2>用户</h2>
                  </div>
                  <div class="searchusers">
                    <ul v-for="(item,index) in searchData.user.users" :key="index">
                      <li >
                        <div class="userimg"><img v-lazy="item.avatarUrl" alt=""></div>
                        <div class="userinform">
                          <p class="p1"><span>{{item.nickname}}</span><i class="iconfont icon-xingbienan" v-if="item.gender == 1"></i>
                            <i class="iconfont icon-xingbienv" v-if="item.gender == 2"></i></p>
                          <p class="p2"><span>{{item.signature}}</span></p>
                        </div>
                        <div class="userbtn">
                          <p>+ 关注</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="bottombtn">
                    <el-divider></el-divider>
                    <p v-if="searchData.user.moreText">
                      <span>{{searchData.user.moreText}}</span><i class="iconfont icon-xiangyou"></i>
                    </p>
                  </div>
                </div>
              </li>
              <li class="comprecontent singlecontent" v-if="activeTip == 'single'">
                <div class="allsingle searchsong clearfix" v-if="searchData.songs!==[]">
                  <ul class="comprelis" v-for="(item ,index) in searchData.songs" :key="index">
                    <el-divider></el-divider>
                    <li>
                      <p class="p1" @click="playSong(item)">
                        <span class="sp1">{{item.name}}</span>
                        <span class="sp2"><i class="iconfont icon-VIP" v-if="item.fee === 1" style="color: red;"></i><span>{{item.artists[0].name}}-{{item.album.name}}</span></span>
                      </p>
                      <p class="p2"><i class="iconfont icon-shipin"></i><i class="iconfont icon-yuandiancaidan" @click="openSongDetail(item)"></i></p>
                    </li>
                  </ul>
                </div>
                <div class="searchusererror" v-if="searchData.songs==[]">未查到“{{inputContent}}”相关的内容</div>
              </li>
              <li class="comprecontent sheetcontent " v-if="activeTip == 'sheet'">
                <div class="searchsheet" v-if="searchData.playlists!==[]">
                  <div class="someSheet" v-for="(item,index) in searchData.playlists" :key="index" @click="openSheets(item.id)">
                    <div class="img"><img v-lazy="item.coverImgUrl" alt=""></div>
                    <div class="someInform">
                      <p class="sheetName"><span>{{item.name}}</span></p>
                      <p class="informs"><span>{{item.trackCount}}首</span> , <span>by{{item.creator.nickname}}</span> , <span>播放{{item.playCount | playCounts(item.playCount)}}次</span></p>
                      <p class="signs"><span v-for="(item2,index2) in item.officialTags" :key="index2">{{item2}}</span></p>
                    </div>
                  </div>
                </div>
                <div class="searchusererror" v-if="searchData.playlists==[]">未查到“{{inputContent}}”相关的内容</div>
              </li>
              <li class="videocontent" v-if="activeTip == 'video'">视频</li>
              <li class="singercontent" v-if="activeTip == 'singer'">
                <ul class="singerUl" v-for="(item ,index) in searchData.artists" :key="index">
                  <li>
                    <p class="p1">
                      <img v-lazy="item.picUrl" alt="">
                      <span>{{item.name}}</span><span class="trans" v-if="item.trans">({{item.trans}})</span>
                    </p>
                    <p class="p2">
                      <span>+ 关注</span>
                    </p>
                  </li>
                  <el-divider class="boline"></el-divider>
                </ul>
                <div class="searchusererror" v-if="searchData.artists==[]">未查到“{{inputContent}}”相关的内容</div>
              </li>
              <li class="comprecontent podcastcontent" v-if="activeTip == 'podcast'">
                <div class="searchsheet" v-if="searchData.djRadios!==[]">
                  <div class="someSheet" v-for="(item,index) in searchData.djRadios" :key="index">
                    <div class="img"><img v-lazy="item.picUrl" alt=""></div>
                    <div class="someInform">
                      <p class="sheetName"><span>{{item.name}}</span></p>
                      <p class="informs"><span>{{item.programCount}}个声音</span> , <span>by{{item.dj.nickname}}</span> , <span>播放{{item.playCount | playCounts(item.playCount)}}次</span></p>
                      <p class="signs"><span v-for="(item2,index2) in item.officialTags" :key="index2">{{item2}}</span></p>
                    </div>
                  </div>
                </div>
                <div class="searchusererror" v-if="searchData.djRadios==[]">未查到“{{inputContent}}”相关的内容</div>
              </li>
              <li class="comprecontent lyriccontent" v-if="activeTip == 'lyric'">
                <div class="searchsong"   v-for="(item,index) in searchData.songs" :key="index">
                  <ul class="comprelis">
                    <li>
                      <p class="p1">
                        <span class="sp1">{{item.name}}</span>
                        <span class="sp2"><span>{{item.artists[0].name}}-{{item.album.name}}</span></span>
                      </p>
                      <p class="p2"><i class="iconfont icon-shipin"></i><i class="iconfont icon-yuandiancaidan"></i></p>
                    </li>
                  </ul>
                  <div class="text">
                    <!--<div class="d1" ><p v-for="(item2,index2) in lyricsData[index].lyricsTxt" :key="index2">{{item2}}</p></div>-->
                    <div class="d2">
                      <p v-for="(item2,index2) in lyricsData[index].lyricsTxt" :key="index2"><span v-if="index2<3">{{item2}}</span></p>
                      <p @click="openCloseLyric(index)"><span>展开歌词</span><i class="iconfont icon-xiangxiajiantou"></i></p>
                      <p @click="openCloseLyric(index)" style="display: none;"><span>收起歌词</span><i class="iconfont icon-xiangshangjiantou"></i></p>
                    </div>
                  </div>
                </div>
                <div class="searchusererror" v-if="searchData.songs==[]">未查到“{{inputContent}}”相关的内容</div>
              </li>
              <li class="comprecontent albumcontent" v-if="activeTip == 'album'">
                <div class="searchalbum" v-if="searchData.albums!==[]">
                  <ul v-for="(item,index) in searchData.albums" :key="index">
                    <li >
                      <div class="alimg"><img v-lazy="item.picUrl" alt=""></div>
                      <div class="alinform">
                        <p class="p1">{{item.name}}</p>
                        <p class="p2"><span>{{item.artist.name}}</span><span v-if="item.containedSong">包含单曲：{{item.containedSong}}</span><span v-if="!item.containedSong">{{item.publishTime | getPublishTime(item.publishTime)}}</span></p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="searchusererror" v-if="searchData.albums==[]">未查到“{{inputContent}}”相关的内容</div>
              </li>
              <li class="comprecontent usercontent" v-if="activeTip == 'user'">
                <div class="searchusers" v-if="searchData.userprofiles!==[]">
                  <ul v-for="(item,index) in searchData.userprofiles" :key="index">
                    <li >
                      <div class="userimg"><img v-lazy="item.avatarUrl" alt=""></div>
                      <div class="userinform">
                        <p class="p1"><span>{{item.nickname}}</span><i class="iconfont icon-xingbienan" v-if="item.gender == 1"></i>
                          <i class="iconfont icon-xingbienv" v-if="item.gender == 2"></i></p>
                        <p class="p2" v-if="item.signature"><span>{{item.signature}}</span></p>
                      </div>
                      <div class="userbtn">
                        <p>+ 关注</p>
                      </div>
                    </li>
                    <el-divider class="boline"></el-divider>
                  </ul>
                </div>
                <div class="searchusererror" v-if="searchData.userprofiles==[]">未查到“{{inputContent}}”相关的内容</div>
              </li>
            </ul>
          </div>
          <div class="showError"  v-loading="isLoading"></div>
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
              isLoading: false,
              isBangLoading:false,
              inputContent:'',
              searchCon:'',
              suggestData:{},
              bangData:{},
              searchData:{},
              tipBs: null,
              moreBs: null,
              isShowSuggest: false,
              isShowSearchList: false,
              searchType:[
                {typeName:'综合',typeId: 1018,tipName: 'compre'},
                {typeName:'单曲',typeId: 1, tipName: 'single'},
                {typeName:'歌单',typeId: 1000, tipName: 'sheet'},
//                {typeName:'视频',typeId: 1014,tipName: 'video'},
                {typeName:'歌手',typeId: 100,tipName: 'singer'},
                {typeName:'播客',typeId: 1009,tipName: 'podcast'},
                {typeName:'歌词',typeId: 1006,tipName: 'lyric'},
                {typeName:'专辑',typeId: 10,tipName: 'album'},
                {typeName:'用户',typeId: 1002,tipName: 'user'},
              ],
              activeTip:'compre',
              activeId: 1018,
              lyricsData:[],
              isOpenLyric:false,
            }
        },
        computed:{
          ...mapState({
            searchContent:'searchContent',
            realKeyWord:'realKeyWord',
            playList:'playList',
            playIndex:'playIndex',
            isPlayList:'isPlayList'
          }),
        },
        methods:{
          ...mapMutations({
            isOpenSearch:"isOpenSearch",
            playSearchSong:'playSearchSong',
            openCloseList:'openCloseList',
            changeIndex:'changeIndex',
            openSheet:'openSheet',
            getSheetSong:'getSheetSong',
            isOpenSongDetail:'isOpenSongDetail'
          }),
          antiShake(fn,delay){
            let timer = null;
            return function(){
              clearTimeout(timer);
              timer = setTimeout(()=>{

                fn.apply(this,arguments)
                console.log(this)

              },delay)
            }
          },
          delContents(){
              this.inputContent= '';
              this.searchData = {};
              this.isShowSearchList = false;
              this.activeTip = 'compre';
              this.activeId = 1018;
          },
          searchSuggest(suggest){ //搜索建议
            this.suggestData = {};
            axios.get(`https://my-wyy.vercel.app/search/suggest?keywords=${suggest}&type=mobile&realIP=116.25.146.177`)
              .then(res=>{
                  if(res.data.code == '200'){
                    this.suggestData = res.data.result;
                  }
              }).catch(()=>{

            })
          },
          hotSearch(){ //热搜榜
              this.isBangLoading = true;
            this.bangData ={}
            axios.get(`https://my-wyy.vercel.app/search/hot/detail?realIP=116.25.146.177`).then(res=>{
                if(res.data.code =='200'){
                    sessionStorage.setItem('bangData',JSON.stringify(res.data.data));
                    this.bangData = res.data.data;
                    this.isBangLoading =false;
                }
            })
          },
          goToSearch(content,types){ // 搜索歌曲
              if(content){
                this.searchCon = content;
                this.inputContent = content
              }else{
                this.searchCon = this.realKeyWord;
                this.inputContent = this.searchContent;
              }
              this.activeId = types;
              this.isShowSuggest = false;
              this.isShowSearchList = true;
              this.isLoading = true;
              this.searchData = {};
              new Promise((resolve,reject)=>{
                axios.get(`https://my-wyy.vercel.app/search?keywords=${this.searchCon}&type=${this.activeId}&limit=100&realIP=116.25.146.177`).then(res=>{
                  if(res.data.code =='200'){
                    this.searchData = res.data.result;
                    this.isLoading = false;
                    if(this.activeTip == 'lyric'){
                      this.lyricsData = [];
                      this.searchData.songs.forEach(ele=>{
                        this.lyricsData.push({lyricsTxt: ele.lyrics.txt.split('\n')})
                      })
                    }
                    resolve(this.isLoading)
                  }
                })
              }).then((res)=>{
                this.$nextTick(()=>{
                  if(!this.tipBs){
                      this.tipBs = new BScroll('.searchtip',{scrollX:true, click: true})
                  }else{
                      this.tipBs.refresh()
                  };
                  if(!res){
                      this.moreBs = null;
                      if(!this.moreBs){
                        this.moreBs = new BScroll('.allSearch',{scrollY:true, click: true})
                      }
                  }
                })
              })
          },
          chooseClick(index,tipName,content,typeId){ // 选择搜索类型
            this.$nextTick(()=>{
              $('.searchlis').eq(index).children('.bottomline').css('display','block');
              $('.searchlis').eq(index).siblings().children('.bottomline').css('display','none');
            })
            this.activeTip = tipName;
            this.goToSearch(content,typeId)
          },
          playSong(item){ //播放搜索到的歌曲
            let isLike = this.isLikeSong(item.id);
            if(isLike.isTrue){
                if(this.playList.length > 0){
                  if((this.playList[this.playIndex].resourceId!==item.id)){
                    this.playSearchSong({list: item, resourceId: item.id, playIndex: 0,activeTip: this.activeTip,});
                    this.openCloseList({isPage:true,isList: !this.isPlayList});
                  }else{
                    this.openCloseList({isPage:true,isList: !this.isPlayList});
                  }
                }else{
                  this.playSearchSong({list: item, resourceId: item.id, playIndex: 0,activeTip: this.activeTip,});
                  this.openCloseList({isPage:true,isList: !this.isPlayList});
                }
            }else{
                this.changeIndex(isLike.count);
                this.openCloseList({isPage:true,isList: !this.isPlayList});
            }
          },
          isLikeSong(songId){ //播放列表中存在的歌曲
               let isTrue = true;
               let count = 0;
              try{
                this.playList.forEach((ele,index)=>{
                  if(ele.resourceId == songId){
                      isTrue = false;
                      count = index;
                      throw Error();
                  }
                })
              }catch (e){}
              return {isTrue,count};
          },
          openSheets(sheetId){
            this.openSheet(true);
            this.getSheetSong({sheetId:sheetId,sheetList:null}); //creativeId
          },
          openCloseLyric(index){
              console.log(index)
              console.log($('.d2').eq(index))
          },
          openSongDetail(item){
            this.isOpenSongDetail({isOpen: true,detail: item});
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
        getPublishTime(ptime){
            let date = new Date(ptime);
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();
          return year+'.'+month+'.'+day;
        }
      },
        watch:{
          inputContent(news,old){
              if(news !== '' && news !== old && news!== this.searchContent && news!== this.searchCon){
                this.isShowSuggest = true;
                this.searchSuggest(news);
              }else{
                  if(news == ''){
                    this.suggestData = {};
                    this.isShowSuggest = false;
                  }
              }
          }
        },
        mounted(){
            if(this.isShowSearchList){
              this.chooseClick(0)
            }

        },
        created(){
            if(JSON.parse(sessionStorage.getItem('bangData'))){
              this.bangData = JSON.parse(sessionStorage.getItem('bangData'));
            }else{
              this.hotSearch()
            }
        },
      beforeDestroy() {

      }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin:  0;
    padding: 0;
  }
  .clearfix:after{
    content: '';
    display: block;
    clear: both;
    overflow: hidden;
  }
  .search{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #eee;
    font-size: 10px;
  }
  .goSearch{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1em 1.4em;
  }
  .goSearch .back{
    flex: 0 0 10%;
    margin: 0 .4em .4em 0;
  }
  .goSearch .back i{
    font-size: 1.8em;
  }
  .goSearch .input{
    flex: 0 0 88%;
    text-align: left;
    border-bottom: 1px solid #000;
  }
  .goSearch .input input{
    position: relative;
    margin-bottom: .4em;
    width: 90%;
    border: 0;
    outline: none;
    font-size: 1.6em;
    background: #eee;
  }
  .goSearch .input .del{
    position: absolute;
    right: 1.4em;
  }
  .goSearch .input input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #aaa;
  }
  .goSearch .input input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #aaa;
  }
  .goSearch .input input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #aaa;
  }
  .goSearch .input input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #aaa;
  }
  .defaultlist .bangcontent{
    background: #fff;
    margin: 0 1.4em;
    border-radius: 1.5em;
  }
  .defaultlist .bangcontent ul{
    width: 100%;
    list-style-type: none;
    padding: 1em 0;
  }
  .defaultlist .bangcontent ul li{
    display: inline-block;
    width: 50%;
    text-align: left;
    margin: 1em 0;
  }
  .defaultlist .bangcontent ul li span{
    font-size: 1.5em;
  }
  .defaultlist .bangcontent ul li span.number{
    display: inline-block;
    margin: 0 1em;
    vertical-align: middle;
  }
  .defaultlist .bangcontent ul li span.keywords{
    display: inline-block;
    vertical-align: middle;
    width: 52%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .defaultlist .bangcontent ul li img{
    width: 15%;
    height: 15%;
    vertical-align: middle;
  }
  .suggestList{
    position: fixed;
    top: 4em;
    left: 0;
    width: 100%;
    height: 100%;
    background: #eee;
    z-index: 2;
  }
  .suggestList>ul{
    list-style-type: none;
  }
  .suggestList>ul li{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #eee;
  }
  .suggestList>ul li p.iconp{
    flex: 0 0 10%;
  }
  .suggestList>ul li p.textp{
    flex: 0 0 90%;
    text-align: left;
  }
  .suggestList>ul li p.textp span{
    display: inline-block;
    margin: .8em 0;
    width: 90%;
    font-size: 1.6em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .searchData{
    position: fixed;
    top: 4em;
    left: 0;
    width: 100%;
    background: #eee;
    z-index: 1;
  }
  .searchData .searchContents .searchtip{
    overflow: hidden;
    text-align: left;
  }
  .searchData .searchContents .searchtip>ul{
    list-style-type: none;
    width: 56em;
  }
  .searchData .searchContents .searchtip>ul li{
    display: inline-block;
    margin: 1em 1.4em;
    width: 3em;
    text-align: center;
  }
  .searchData .searchContents .searchtip>ul li span.typename{
    display: inline-block;
    font-size: 1.4em;
  }
  .searchData .searchContents .searchtip>ul li span.bottomline{
    display: none;
    margin-top: -.5em;
    width: 3em;
    height: .5em;
    background: #dc2c1f;
    border-radius: 1.2em;
  }
  .searchData .searchContents .searchtip>ul li:first-child span.bottomline{
    display: block;
  }
  .showError{
    margin-top: 15em;
    width: 100%;
  }
  .searchData .searchContents .allSearch{
    position: fixed;
    top: 8em;
    left: 0;
    padding-top: 1em;
    background: #eee;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .searchData .searchContents .allSearch>ul{
    list-style-type: none;
    margin: 0 1.6em;
  }
  .searchData .searchContents .allSearch .bottombtn{
    height: 4em;
    line-height: 4em;
  }
  .searchData .searchContents .allSearch .bottombtn p i, .searchData .searchContents .allSearch .bottombtn p span{
    vertical-align: middle;
  }
  .searchData .searchContents .allSearch .comprecontent{}
  .searchtitle{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .searchtitle h2{
    margin: 1em 1em .5em 1em;
    font-size: 1.6em;
  }
  .searchtitle p{
    margin: 1em 1em .5em 1em;
    padding: 0 .6em;
    border: .1em solid #ccc;
    border-radius: 1.5em;
  }
  .searchtitle p i{
    vertical-align: middle;
    font-size: 1.2em;
  }
  .searchtitle p span{
    vertical-align: middle;
    font-size: 1.2em;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong{
    background: #fff;
    border-radius: 1.5em;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul.comprelis{
    list-style-type: none;
    margin: 0 1.6em;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul.comprelis>li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1em;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul.comprelis>li>p.p1{
    width: 80%;
    text-align: left;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul.comprelis>li>p.p1 span.sp1{
    display: block;
    font-size: 1.6em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul.comprelis>li>p.p1 span.sp2{
    display: inline-block;
    color: #999;
    font-size: 1.2em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul.comprelis>li>p.p2 span.sp2 span{
    vertical-align: middle;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul.comprelis>li>p.p2 span.sp2 i{
    vertical-align: middle;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul.comprelis>li>p.p2{
    text-align: center;
    width: 20%;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul>li>p.p2 i{
    color: #bbb;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsong>ul>li>p.p2 i.icon-yuandiancaidan{
    margin: 1em;
    font-size: 2em;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsheet{
    margin-top: 1.5em;
    background: #fff;
    border-radius: 1.5em;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsheet .someSheet{
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    margin: 1em 1.4em;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsheet .someSheet .img{
    flex: 0 0 10%;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsheet .someSheet .img img{
    width: 6em;
    height: 6em;
    border-radius: 1.2em;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsheet .someSheet .someInform{
    flex: 0 0 85%;
    width: 85%;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsheet .someSheet .someInform .sheetName{
    margin: 0 1em;
    width: 90%;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsheet .someSheet .someInform .sheetName span{
    display: inline-block;
    font-size: 1.6em;
    width: 100%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsheet .someSheet .someInform .informs{
    display: inline-block;
    margin: .5em 1em;
    width: 90%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .searchData .searchContents .allSearch .comprecontent .searchsheet .someSheet .someInform .signs span{
    display: inline-block;
    margin: 0 .5em;
    color: #E6A23C;
  }
  .searchData .searchContents .allSearch .comprecontent .searchyiren, .searchData .searchContents .allSearch .comprecontent .compreuser{
    margin: 1em 0;
    background: #fff;
    border-radius: 1.5em;
  }
  .searchData .searchContents .allSearch .singlecontent{}
  .searchData .searchContents .allSearch .singlecontent .allsingle{}
  .searchData .searchContents .allSearch .sheetcontent{
    margin-top: 1em;
    padding: 1em 0;
    background: #fff;
    border-radius: 1.5em;
  }
  .searchData .searchContents .allSearch .videocontent{}
  .searchData .searchContents .allSearch .singercontent{
    width: 100%;
  }
  .searchData .searchContents .allSearch .singercontent .singerUl{
    list-style-type: none;
  }
  .boline{
    margin-left: 6em;
  }
  .searchData .searchContents .allSearch .singercontent .singerUl>li{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .searchData .searchContents .allSearch .singercontent .singerUl>li p.p1{
    flex: 0 0 80%;
    text-align: left;
    width: 80%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .searchData .searchContents .allSearch .singercontent .singerUl>li p.p1 img{
    margin: 1em;
    width: 5em;
    height: 5em;
    border-radius: 50%;
    vertical-align: middle;
  }
  .searchData .searchContents .allSearch .singercontent .singerUl>li p.p1 span{
    display: inline-block;
    vertical-align: middle;
    font-size: 1.3em;
  }
  .searchData .searchContents .allSearch .singercontent .singerUl>li p.p2{
    flex: 0 0 20%;
    text-align: left;
  }
  .searchData .searchContents .allSearch .singercontent .singerUl>li p.p2 span{
    display: inline-block;
    padding: .1em .8em;
    border: 1px solid #dc2c1f;
    font-size: 1.2em;
    color: #dc2c1f;
    width: 3em;
    height: 1.4em;
    line-height: 1.4em;
    border-radius: 1.5em;
  }
  .searchData .searchContents .allSearch .podcastcontent{
    padding: 1em 0;
    background: #fff;
    border-radius: 1.5em;
  }
  .searchData .searchContents .allSearch .lyriccontent{
    margin-top: 1em;
    padding: 1em 0;
    background: #fff;
    border-radius: 1.5em;
  }
  .searchData .searchContents .allSearch .lyriccontent .text{
    margin: 0 2.6em;
    text-align: left;
  }
  .searchData .searchContents .allSearch .lyriccontent .text p span{
    margin-top: .5em;
    display: inline-block;
  }
  .searchData .searchContents .allSearch .lyriccontent .text p i{
    margin: 0 .5em;
    font-size: 1em;
  }
  .searchData .searchContents .allSearch .albumcontent{
    padding-top: 1em;
    background: #fff;
    border-radius: 1.5em;
  }
  .searchData .searchContents .allSearch .albumcontent .searchalbum>ul{
    padding: 1em;
    list-style-type: none;
  }
  .searchData .searchContents .allSearch .albumcontent .searchalbum>ul>li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  .searchData .searchContents .allSearch .albumcontent .searchalbum>ul>li .alimg{
    flex: 0 0 20%;
    width: 6em;
    height: 6em;
  }
  .searchData .searchContents .allSearch .albumcontent .searchalbum>ul>li .alimg img{
    width: 100%;
    height: 100%;
    border-radius: 1.5em;
  }
  .searchData .searchContents .allSearch .albumcontent .searchalbum>ul>li .alinform{
    flex: 0 0 80%;
    margin-left: 1em;
    width: 80%;
  }
  .searchData .searchContents .allSearch .albumcontent .searchalbum>ul>li .alinform p.p1{
    margin-bottom: .5em;
    width: 95%;
    font-size: 1.6em;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .searchData .searchContents .allSearch .albumcontent .searchalbum>ul>li .alinform p.p2{
    width: 80%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .searchData .searchContents .allSearch .albumcontent .searchalbum>ul>li .alinform p.p2 span{
    margin: 0 .5em;
  }
  .searchData .searchContents .allSearch .usercontent{}
  .searchData .searchContents .allSearch .usercontent .searchusers{}
  .searchData .searchContents .allSearch .usercontent .searchusers>ul{
    margin: 1em 0;
    text-align: left;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 1em 0;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userimg{
    flex: 0 0 15%;
    width: 5em;
    height: 5em;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userimg>img{
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userinform{
    flex: 0 0 65%;
    width: 65%;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userinform p.p1{
    margin-left: 1em;
    margin-bottom: .5em;
    width: 100%;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userinform p.p1 span{
    font-size: 1.5em;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userinform p.p1 i{
    margin-left: .3em;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userinform p.p1 i.icon-xingbienan{
    color: skyblue;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userinform p.p1 i.icon-xingbienv{
    color: hotpink;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userinform p.p2{
    margin-left: 1em;
    width: 100%;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userinform p.p2 span{
    display: inline-block;
    width: 90%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userbtn{
    flex: 0 0 20%;
    width: 20%;
    text-align: center;
  }
  .searchData .searchContents .allSearch .usercontent .searchusers>ul>li .userbtn p{
    padding: .2em 0;
    border: 1px solid #dc2c1f;
    border-radius: 1.5em;
    width: 80%;
    color: #dc2c1f;
  }
</style>
