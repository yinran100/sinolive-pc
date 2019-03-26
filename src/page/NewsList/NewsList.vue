<template>
  <div class="news-wrapper">
    <ul
      class="news-list"
      v-if="newsList.length!=0"
    >
      <li
        class="news-item"
        v-for="item in newsList"
        :class="{'news-item-col':item.itemType==1}"
        :key="item.articleId"
      >
        <div
          class="item-info"
          v-if="item.itemType==0"
        >
          <router-link
            :to="`/main/newspage/${item.articleId}`"
            class="title"
          >
            {{item.title}}
          </router-link>
          <div class="desc">{{item.coverAbstract}}</div>
          <div class="clearfix">
            <div class="date"><i class="el-icon-date"></i>{{ item.updateTime*1000|timeMoment }}</div>
            <div class="tips-wrapper">
              <span><i class="el-icon-view"></i>{{item.readingQuantity}}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <router-link
            class="title"
            :to="`/main/newspage/${item.articleId}`"
          >
            {{item.title}}
          </router-link>
        </div>

        <router-link
          :to="`/main/newspage/${item.articleId}`"
          class="photo-wrapper"
          v-if="item.itemType==0"
        >
          <img
            class="news-img"
            alt=""
            :src="item.coverImgs[0]"
          >
        </router-link>
        <div
          class="photo-line"
          v-else
        >
          <router-link
            class="photo-wrapper"
            :to="`/main/newspage/${item.articleId}`"
            v-for='(img,index) in item.coverImgs'
            :key='index'
          >
            <img
              class="news-img"
              alt=""
              :src="img"
            >
          </router-link>
        </div>
        <div
          class="clearfix"
          v-if="item.itemType==1"
        >
          <div class="date"><i class="el-icon-date"></i><Time :time="item.updateTime" /></div>
          <div class="tips-wrapper">
            <span><i class="el-icon-view"></i>{{item.readingQuantity}}</span>
          </div>
        </div>
      </li>
    </ul>
    <el-alert
      v-else
      title="没有新闻的数据"
      type="info"
      :closable="false"
      center
      show-icon
    >
    </el-alert>
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="20">
        <el-button
          v-show="!noMoreData"
          style="width:100%"
          @click="loadNewsList"
        >查看更多</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getNewsList } from "@/api/api";
export default {
  name: "NewsList",

  data() {
    return {
      page: 1,
      offset: 5,
      newsList: [],
      noMoreData: false,
      keywords: ""
    };
  },
  created() {
    this.loadNewsList();
  },
  methods: {
    loadNewsList() {
      getNewsList({
        page: this.page,
        offset: this.offset
      }).then(
        res => {
          if (res.notices && res.notices.length < this.offset) {
            this.noMoreData = true;
          }
          this.page++;
          this.newsList = this.newsList.concat(
            res.notices.map(
              ({
                articleId,
                title,
                coverImagePath1,
                coverImagePath2,
                coverImagePath3,
                readingQuantity,
                coverAbstract,
                updateTime
              }) => {
                return {
                  articleId,
                  title,
                  updateTime,
                  coverAbstract,
                  coverImgs: [
                    coverImagePath1,
                    coverImagePath2,
                    coverImagePath3
                  ],
                  readingQuantity,
                  itemType:
                    coverImagePath2 != "" && coverImagePath2 != "" ? 1 : 0
                };
              }
            )
          );
        },
        e => this.showMessage(e.data.message)
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.news-wrapper>>>.clearfix
  margin-top: 3px

  .date
    float: left
    color: #9b9b9b
    font-size: 15px

    .el-icon-date
      margin-right: 3px

  .tips-wrapper
    font-size: 15px
    float: right
    margin-right: 16px
    color: #9b9b9b

    .el-icon-view
      margin-right: 5px

.news-wrapper
  background-color: #fff
  padding: 10px 30px

  .news-list
    padding: 0 10px

    .news-item, .news-item-col
      display: flex
      padding: 10px 0

      &:nth-last-child(n+2)
        border-bottom: 1px solid #DADADA

      .item-info
        flex: 1
        margin-right: 10px

    .title
      font-size: 18px
      color: #07f
      font-weight: bold
      cursor: pointer

      &:hover
        text-decoration: underline

    .desc
      font-size: 14px
      line-height: 1.5
      min-height: 63px
      color: #686868

    .photo-wrapper
      height: 120px
      width: 200px
      margin-right: 20px
      margin-bottom: 5px
      background-color: #dfdfdf
      overflow: hidden

      .news-img
        width: 100%
        height: 100%
        transition: all 0.3s

        &:hover
          transform: scale(1.1)

    .news-item-col
      flex-direction: column

      .photo-line
        margin-top: 5px
        display: flex

.el-alert
  margin: 10px 0
</style>
