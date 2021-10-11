<template>
    <div class="boutique">
      <div class="isClose" @click="backs(null)"></div>
      <div class="allBoutiqueTip">
      <div class="boutiquetitle">
        <h2>所有精品歌单</h2>
        <p><i class="iconfont icon-guanbi" @click="backs(null)"></i></p>
      </div>
        <div class="boutiqueswiper">
          <ul>
            <li class="all"><span @click="backs('全部',0)">全部精品</span></li>
            <li v-for="(item,index) in boutiqueData" :key="item.id">
              <p @click="backs(item.name,index+1)">{{item.name}}</p>
            </li>
          </ul>
        </div>
        <div class="loading" v-loading="isBueLoading"></div>
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
              boutiqueData:[],
              bueBs:null,
              isBueLoading:false,
            }
        },
        methods:{
            getBoutiqueType(){
                this.isBueLoading = true;
                axios.get(`https://my-wyyapi.vercel.app/playlist/highquality/tags?realIP=116.25.146.177`).then(res=>{
                    if(res.data.code == '200'){
                      sessionStorage.setItem('boutiqueData',JSON.stringify(res.data.tags))
                      this.boutiqueData = res.data.tags;
                      this.isBueLoading = false;
                    }
                })
            },
            backs(name,index){
                this.$emit('backMore',{isClose:false,tipName:name})
                sessionStorage.setItem('checkTip',index)
            },
            clickBtn(index){
                $('.boutiqueswiper>ul>li').eq(index).children().css({background:'red',color:'#eee'})
                $('.boutiqueswiper>ul>li').eq(index).siblings().children().css({background:'#eee',color:'#000'})
            }
        },
        updated(){
          this.$nextTick(()=>{
            this.bueBs = null;
              if(!this.bueBs){
                this.bueBs = new BScroll('.boutiqueswiper',{scrollY:true,momentum: true,click:true,bounce:false,probeType:3});
              }
              })
        },
        mounted(){
            if(sessionStorage.getItem('checkTip')){
              this.clickBtn(sessionStorage.getItem('checkTip'))
            }else{
              this.clickBtn(0)
            }
          this.$nextTick(()=>{
            this.bueBs = null;
            if(!this.bueBs){
              this.bueBs = new BScroll('.boutiqueswiper',{scrollY:true,momentum: true,click:true,bounce:false,probeType:3});
            }
          })
        },
        created(){
            if(JSON.parse(sessionStorage.getItem('boutiqueData'))){
              this.boutiqueData = JSON.parse(sessionStorage.getItem('boutiqueData'))
            }else{
              this.getBoutiqueType()
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .boutique{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
  }
  .isClose{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0, .6);
    z-index: 5;
  }
  .allBoutiqueTip{
    position: fixed;
    bottom: 0;
    left: 0;
    height: 60%;
    width: 100%;
    background: #fff;
    border-top-right-radius: 1.2em;
    border-top-left-radius: 1.2em;
    z-index: 6;
  }
  .boutiquetitle{
    position: relative;
    margin: 2em;
  }
  .boutiquetitle>h2{
    font-size: 1.8em;
  }
  .boutiquetitle>p{
    position: absolute;
    right: 0;
    top: 0;
    background: #ccc;
    width: 2.5em;
    height: 2.5em;
    border-radius: 50%;
    text-align: center;
    line-height: 2.5em;
  }
  .boutiquetitle>p>i{
    font-size: 1em;
    font-weight: 600;
  }
  .boutiqueswiper{
    overflow: hidden;
    height: 100%;
  }
  .boutiqueswiper>ul{
    display: flex;
    flex-wrap: wrap;
    margin: 0 1em;
    list-style-type: none;
    text-align: center;
    align-items: flex-start;
    padding-bottom: 6em;
  }
  .boutiqueswiper>ul>li{
    flex: 0 0 25%;
    width: 100%;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .boutiqueswiper>ul>li>p{
    margin: 1em;
    padding: 1em .5em;
    background: #eee;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 1.5em;
  }
  .boutiqueswiper>ul>li:first-child{
    flex: 0 0 100%;
  }
  .boutiqueswiper>ul .all>span{
    display: inline-block;
    width: 95%;
    padding: 1em 0;
    background: red;
    border-radius: 1.5em;
    color: #eee;
  }
  .loading{
    position: absolute;
    top: 50%;
    width: 100%;
  }
</style>
