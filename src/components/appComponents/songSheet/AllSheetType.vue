<template>
    <div class="sheetType">
      <div class="back" @click="backs(0,sheetTips[0])"><i class="iconfont icon-icon-test1"></i><span>歌单标签</span></div>
      <div class="loading" v-loading="isTypeLoading"></div>
      <div v-if="sheetTypeData.length == 0?false:true" class="allType">
        <ul>
          <li>
            <div class="typeTitle">我的歌单广场</div>
            <ul>
              <li v-for="(item,index) in sheetTips" :key="index" @click="backs(index,item)"><button>{{item}}</button></li>
            </ul>
          </li>
          <li v-for="(item1,index1) in otherType" :key="index1">
            <div class="typeTitle">{{item1}}</div>
            <ul>
              <li v-for="(item2,index2) in sheetTypeData[index1]" :key="index2" @click="goOtherList(item2)"><button :disabled="sheetTips.find((ele)=>(ele == item2.name))">{{item2.name}}</button></li>
            </ul>
          </li>
        </ul>
      </div>
      <OtherSheetList v-if="isOpenOtherList" :actTips="actTip" @backSheet="backSheets"></OtherSheetList>
    </div>
</template>
<script>
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import $ from 'jquery';
  import BScroll from 'better-scroll';
  import axios from 'axios';
  import OtherSheetList from './OtherSheetList.vue'
    export default {
        props:{
          sheetTips: Array
        },
        data(){
            return{
              sheetTypeData:[],
              otherType:[],
              isTypeLoading:false,
              typeBs:null,
              isOpenOtherList: false,
              actTip:''
            }
        },
        components:{
          OtherSheetList
        },
        computed:{
            isEmpty(){
                return (obj)=>{
                    for(let key in obj){
                        if(obj.hasOwnProperty(key)){
                            return false;
                        }
                    }
                    return true;
                }
            }
        },
        filters:{},
        methods:{
            backs(index,item){
                this.$emit('cloSheetType',{isClose:false,tipIndex: index,tip:item})
            },
            getSheetType(){
                this.isTypeLoading = true;
                this.sheetTypeData = [];
                axios.get(`https://my-wyyapi.vercel.app/playlist/catlist?realIP=116.25.146.177`).then((res)=>{
                    if(res.data.code == '200') {
                      this.getSheetTypeData(res.data)
                      sessionStorage.setItem('otherTypeData',JSON.stringify(res.data))
                      this.isTypeLoading = false;
                      return this.isTypeLoading;
                    }
                }).then(res=>{
                   if(!res){
                     this.typeBs = null;
                     if(!this.typeBs){
                        this.typeBs = new BScroll('.allType',{scrollY:true, click: true});
                     }
                   }
                })
            },
          getSheetTypeData(obj){
            let list = [];
            for(let k in obj.categories){
              this.otherType.push(obj.categories[k]);
              obj.sub.find((ele,index)=>{
                if(ele.category == k){
                  list.push(ele)
                }
                if(index == obj.sub.length-1){
                  this.sheetTypeData.push(list)
                  list = [];
                  return
                }
              })
            }
          },
            goOtherList(item){
                this.actTip = item.name;
                this.isOpenOtherList = true;
            },
            backSheets(e){
              this.isOpenOtherList = false;
            }
        },
      updated(){
        this.$nextTick(()=>{
          this.typeBs = null;
          if(!this.typeBs){
            this.typeBs = new BScroll('.allType',{scrollY:true, click: true});
          }
        })
      },
      mounted(){
            this.$nextTick(()=>{
              this.typeBs = null;
              if(!this.typeBs){
                this.typeBs = new BScroll('.allType',{scrollY:true, click: true});
              }
            })
      },
      created(){
            if(JSON.parse(sessionStorage.getItem('otherTypeData'))){
                this.getSheetTypeData(JSON.parse(sessionStorage.getItem('otherTypeData')));
            }else{
              this.getSheetType()
            }
      },
      beforeDestroy() {}
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    padding: 0;
    margin: 0;
  }
  .sheetType{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 4;
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
  .allType{
    overflow: hidden;
    height: 100%;
  }
  .allType ul{
    list-style-type: none;
    text-align: left;
  }
  .allType>ul{
    padding-bottom: 6em;
  }
  .allType>ul>li{
    margin: 2em 1.4em;
  }
  .allType>ul>li .typeTitle{
    font-size: 1.4em;
  }
  .allType>ul>li>ul{
    display: flex;
    flex-wrap: wrap;
    margin: 1em 0;
  }
  .allType>ul>li>ul>li{
    flex: 0 0 25%;
    text-align: center;
    border-radius: 1.5em;
  }
  .allType>ul>li>ul>li>button{
    margin: .5em 0;
    display: inline-block;
    padding: .6em 1em;
    width: 95%;
    border: 0;
    outline: none;
    border-radius: 1.5em;
    white-space: nowrap;
  }
  .loading{
    position: fixed;
    top: 50%;
    width: 100%;
  }
</style>
