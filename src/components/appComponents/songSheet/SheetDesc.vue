<template>
    <div class="desc" :style="{background:descData.backgroundCoverUrl?`url(${descData.backgroundCoverUrl})`:'rgba(0,0,0,.8)',backgroundSize:'200%',backgroundPosition:'center'}">
      <div class="sheetdesc"  v-if="descData.length !==0? true :false">
        <div class="allContent">
          <div class="closeDesc">
            <i class="iconfont icon-guanbi" @click="backs"></i>
          </div>
          <div class="img">
            <img v-lazy="descData.coverImgUrl" alt="">
          </div>
          <div class="sheetName">
            <p>{{descData.name}}</p>
            <el-divider></el-divider>
          </div>
          <div class="tip">
            <span class="tops">标签：</span><span v-for="(item,index) in descData.tags">{{item}}</span>
          </div>
          <div class="text">
            {{descData.description}}
          </div>
        </div>
        <div class="bottombtn">
          <span @click="downLoadImages(descData.coverImgUrl)">保存封面</span>
        </div>
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
               descData:{}
            }
        },
        methods:{
          ...mapMutations({
            changeSheetDesc:'changeSheetDesc'
          }),
          backs(){
              this.changeSheetDesc(false)
          },
          downLoadImages(imgSrc,name){ // 下载服务器的图片（服务器中设置响应头Access-Control-Allow-Origin）
              let img = new Image(); //实例化一个img对象
              img.setAttribute('crossOrigin','anonymous'); // 允许img跨域
              img.onload = ()=>{
                  let canvas = document.createElement('canvas');//创建一个新的canvas
                  canvas.width = img.width; //将图片的宽高赋给canvas
                  canvas.height = img.height;
                  let context = canvas.getContext('2d');//实例化一个canvas
                  context.drawImage(img,0,0,img.width,img.height);// 根据图片的宽高在canvas里把图片描绘出来
                  let url = canvas.toDataURL('image/png');//将canvas转码成base64
                  let a = document.createElement('a'); //创建一个a标签
                  let event = new MouseEvent('click'); //创建一个点击事件
                  a.download = name || ( 'wangyiyun'+ new Date().getTime()); //给下载的图片命名
                  a.href = url;  // 将base64码作为地址赋予创建的a标签
                  a.dispatchEvent(event);// 在a标签触发点击事件下载图片
              };
              img.src = imgSrc;//将所有下载的图片地址赋予实例化的img;
          }
        },
        created(){
            if(JSON.parse(sessionStorage.getItem('sheetList'))){
                this.descData = JSON.parse(sessionStorage.getItem('sheetList'));
                console.log(this.descData)
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
  .desc{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    font-size: 10px;
  }
  .sheetdesc{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.6);
    z-index: 0;
  }
  .allContent{
    margin: 0 2em;
  }
  .sheetdesc .allContent .closeDesc{
    margin: 2em 0;
    text-align: right;
  }
  .sheetdesc .allContent .closeDesc>i{
    color: #fff;
    font-size: 1.8em;
  }
  .sheetdesc .allContent .img{
    margin: 4.8em auto 0;
    width: 20em;
    height: 20em;
  }
  .sheetdesc .allContent .img img{
    width: 100%;
    height: 100%;
    border-radius: 1.5em;
  }
  .sheetdesc .allContent .sheetName{
    margin: 2em auto 1em;
    width: 22em;
  }
  .sheetdesc .allContent .sheetName>p{
    margin: 2em 0;
    color: #ddd;
  }
  .sheetdesc .allContent .tip{
    margin: 1.5em 0 2em;
    text-align: left;
    width: 100%;
  }
  .sheetdesc .allContent .tip> span{
    display: inline-block;
    padding: .3em 1em;
    margin: 0 .5em;
    background: rgba(255,255,255,.2);
    border-radius: 15em;
    color: #ddd;
  }
  .sheetdesc .allContent .tip> span.tops{
    padding: 0 0 0 1em;
    margin: 0;
    background: transparent;
  }
  .sheetdesc .allContent .text{
    margin: 0 1em;
    text-align: left;
    color: #ddd;
  }
  .sheetdesc .bottombtn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    margin: 0 auto 3em;
  }
  .sheetdesc .bottombtn>span{
    display: inline-block;
    padding: .5em 2em;
    border: .1em solid #ddd;
    color: #ddd;
    border-radius: 1.5em;
  }
</style>
