import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rName:'MyFound', //路由名
    isPlayList:false, //打开大播放器或者小播放器
    isPlayPage:false, //打开播放页面
    isSearch: false, //打开搜索页面
    isMenu: true, // 是否显示底部菜单栏
    isMoreSheet:false,// 是否打开歌单广场
    playList:[], // 播放列表
    playIndex:-1, //播放歌曲下标
    songId:0, //歌曲的id
    songContent:{}, // 播放歌曲信息
    songSheet:{},//歌单信息
    isOpenSheet:false, // 是否打开歌单
    sheetId:0, // 歌单的id
    sheetList:[], //歌单信息
    searchContent:'', //展示的搜索关键词
    realKeyWord: '',  //真正的搜索关键词
    sheetActiveTip:'推荐',//歌单正在打开类型
    isOpenSheetDesc:false, //是否打开歌单描述页面
    isSongDetail: false, //是否打开歌单歌曲详情
    songDetail:{}, //歌单歌曲详情
    commentData:{}, //评论数据
  },
  mutations: {
    resolveComment(state,comment){ //接受评论数据
      state.commentData = comment;
    },
    isOpenSongDetail(state,backData){ // 是否打开歌单歌曲详情
      state.isSongDetail = backData.isOpen;
      state.songDetail = backData.detail;
    },
    changeSheetDesc(state,isOpen){ //是否打开歌单描述页面
      state.isOpenSheetDesc = isOpen;
    },
    changeActiveTip(state,tip){ // 改变打开歌单类型
      state.sheetActiveTip = tip;
    },
    openMoreSheet(state,isOpen){ //打开/关闭歌单广场
      state.isMoreSheet = isOpen;
    },
    changeShowMenu(state,isShow){ //是否展示底部导航栏
      state.isMenu = isShow;
    },
    isOpenSearch(state,isOpen){ //是否打开搜索页面
      state.isSearch = isOpen.openSearch;
      state.searchContent = isOpen.searchContent;
      state.realKeyWord = isOpen.realKeyWord;
    },
    openCloseList(state,isOpen){  // 打开或关闭播发器
      state.isPlayPage = isOpen.isPage;
      state.isPlayList = isOpen.isList;
    },
    openSheet(state,isOpen){ //打开或关闭歌单
      state.isOpenSheet = isOpen;
      console.log('2333')
    },
    changeIndex(state,index){
      state.playIndex = index;
      if(index !== -1){
        state.songId = state.playList[index].resourceId;
      }
    },
    getPlayList(state,list){ //获取播放列表
      if(list.playIndex === -1){
        state.playList = [];
        list.playlist.forEach((ele,index)=>{
          if(ele == list.song){
            state.playIndex = index;
            state.songId = ele.resourceId
          }
          state.playList.push({
            duration:ele.resourceExtInfo.songData.duration,
            imageUrl:ele.uiElement.image.imageUrl,
            arName:ele.resourceExtInfo.artists,
            songName:ele.resourceExtInfo.songData.name,
            resourceId:ele.resourceId,
            fee:ele.resourceExtInfo.songData.fee,
          })
        })
      }else{
        state.playList =  list.playlist;
        state.songContent = list.song;
        state.songId = list.playlist[list.playIndex].resourceId
        state.playIndex = list.playIndex;
      }
    },
    changePlayList(state,index){ // 删除播放列表歌曲
      if(index !== -1){
        state.playList.splice(index, 1);
      }else{
        state.playList = [];
        state.songId = 0;
        state.playIndex = index;
      }
    },
    changeNextSong(state,list){ // 改变下一首播放的歌曲
        state.playList.splice(list.index, 0,list.song);
    },
    getSheetSong(state,list){ //获取歌单Id,歌单详情
      state.sheetId = list.sheetId;
      state.sheetList = list.sheetList;
    },
    getSongSheetData(state,listData){ //获取歌单信息
      state.songSheet = listData;
    },
    playSearchSong(state,updata){ //播放搜索到的歌曲
      if(updata.activeTip == 'single'){
        state.playList.unshift({
          duration: updata.list.duration ,
          imageUrl: updata.list.album.artist.img1v1Url,
          arName: updata.list.artists,
          songName:updata.list.name,
          songMinName: updata.list.album.name,
          resourceId:updata.list.id,
          fee:updata.list.fee,
          mv: updata.list.mv,
        });
      }
      if(updata.activeTip == 'compre'){
        state.playList.unshift({
          duration:updata.list.dt? updata.list.dt : updata.list.duration ,
          imageUrl:updata.list.al.picUrl? updata.list.al.picUrl : updata.list.album.artist.img1v1Url,
          arName:updata.list.ar? updata.list.ar : updata.list.artists,
          songName:updata.list.name,
          songMinName:updata.list.al.name? updata.list.al.name : updata.list.album.name,
          resourceId:updata.list.id,
          fee:updata.list.fee,
          mv: updata.list.mv,
        });
      }
      state.songId = updata.resourceId;
      state.playIndex = updata.playIndex;
    },
  },
  actions: {
     openAllSheets(context, id){
       context.commit('openSheet',id)
     }
  },
  modules: {
  }
})
