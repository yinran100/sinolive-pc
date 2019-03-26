<template>
  <div class="lottchart-wrapper">
    <el-form
      :model="termForm"
      size="small"
      :inline="true"
    >
      <el-form-item label="显示期数">
        <el-input
          type="tel"
          v-model="termForm.offset"
        ></el-input>
      </el-form-item>
      <el-form-item label="冷热期数">
        <el-input
          type="tel"
          v-model="termForm.hot"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getData"
        >查询</el-button>
      </el-form-item>
    </el-form>

    <!-- :summary-method="getMaxYilou"
      show-summary -->
    <el-table
      :data="lottChartData"
      border
      max-height="1000"
      :summary-method="getMaxYilou"
      show-summary
      :cell-class-name="cellClass"
      row-key="Id"
    >
      <el-table-column
        prop="Lottery_no"
        label="期号"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="幸运魔方开奖号码"
        align="center"
      >
        <el-table-column
          prop="First_0"
          label="第一局"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="First_1"
          label="第二局"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="First_2"
          label="第三局"
          align="center"
        >
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="冷热号"
        align="center"
      >
        <el-table-column
          prop="First_hot_0"
          label="0"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="First_hot_1"
          label="1"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="First_hot_2"
          label="2"
          align="center"
        >
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="组合"
        align="center"
      >
        <el-table-column
          label="01"
          align="center"
          prop="First_01"
        >
          <template slot-scope="scope">
            <div v-text="scope.$index<lottChartData.length&&scope.row.First_01==0?'01':scope.row.First_01"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="First_02"
          label="02"
          align="center"
        >
          <template slot-scope="scope">
            <div v-text="scope.$index<lottChartData.length&&scope.row.First_02==0?'02':scope.row.First_02"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="First_12"
          label="12"
          align="center"
        >
          <template slot-scope="scope">
            <div v-text="scope.$index<lottChartData.length&&scope.row.First_12==0?'12':scope.row.First_12"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="First_012"
          label="012"
          align="center"
        >
          <template slot-scope="scope">
            <div v-text="scope.$index<lottChartData.length&&scope.row.First_012==0?'012':scope.row.First_012"></div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="First_baozi"
        label="豹子号"
        align="center"
      >
        <template slot-scope="scope">
          <div v-text="scope.$index<lottChartData.length&&scope.row.First_baozi==0?scope.row.First_result:scope.row.First_baozi"></div>
        </template>
      </el-table-column>
    </el-table>
    <div class="tips">
      <p><i class="el-icon-warning"></i>网站提醒：图表数据仅供参考使用，并不作为最终投注依据，本站力求周全，但不保证绝对精准。</p>
      <p>【出现次数】指在统计期数内某统计项实际出现的次数</p>
      <p>【最大遗漏】某统计项在历史数据统计期数内最多遗漏的期数 </p>
    </div>
  </div>
</template>

<script>
import { getLottChartData } from "@/api/api";
export default {
  data() {
    return {
      termForm: {
        offset: 25,
        hot: 8
      },
      intervaler: null,
      localhot: 0,
      totalData: [],
      lottChartData: []
    };
  },
  mounted() {
    this.getData();
    this.intervaler = setInterval(() => this.getData(), 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervaler);
  },
  computed: {
    boxClass() {
      const equal = (row, column, propName) => {
        //遗漏为零
        return column.property === propName && row[propName] === 0 ? 0 : -1;
      };
      const more = (row, column, propName) => {
        //冷热号判断
        if (column.property === propName && row[propName] !== this.localhot) {
          return row[propName] < this.localhot ? 0 : 1;
        } else return -1;
      };
      return [
        //数据字段和其对应的样式
        {
          propName: "First_01",
          className: ["redbox"],
          condition: equal
        },
        {
          propName: "First_02",
          className: ["yellowbox"],
          condition: equal
        },
        {
          propName: "First_12",
          className: ["greenbox"],
          condition: equal
        },
        {
          propName: "First_012",
          className: ["bluebox"],
          condition: equal
        },
        {
          propName: "First_baozi",
          className: ["purplebox"],
          condition: equal
        },
        {
          propName: "First_hot_0",
          className: ["hot1", "hot2"],
          condition: more
        },
        {
          propName: "First_hot_1",
          className: ["hot1", "hot2"],
          condition: more
        },
        {
          propName: "First_hot_2",
          className: ["hot1", "hot2"],
          condition: more
        }
      ];
    }
  },
  methods: {
    cellClass(param) {
      const { row, column, rowIndex, columnIndex } = param;
      if (rowIndex > this.lottChartData.length - 1) {
        return "total";
      } else {
        let classIndex = []; //目标格子的类名集合
        let res = this.boxClass.filter(item => {
          let temp = item.condition(row, column, item.propName);
          if (temp >= 0) {
            classIndex.push(temp);
            return true;
          } else return false;
        });
        return res.length > 0 ? res[0].className[classIndex[0]] : ""; //一个格子 目前只有一个类名
      }
    },
    getData() {
      this.localhot = this.termForm.hot;
      if (isNaN(this.termForm.offset)) this.termForm.offset = 0;
      if (isNaN(this.termForm.hot)) this.termForm.hot = 8;
      getLottChartData({
        offset: this.termForm.offset,
        hot: this.termForm.hot
      }).then(res => {
        this.totalData = res.data.Total;
        this.lottChartData = res.data.Hnxycs;
      });
    },
    getMaxYilou(param) {
      return {
        //col属性是重写组件里的，若底部统计只有一行，可用官方的例子，直接返回一个数组，若有多行，请放在对象里的col属性里；
        col: [
          [
            "出现次数",
            "-",
            "-",
            "-",
            this.totalData.First_count_0,
            this.totalData.First_count_1,
            this.totalData.First_count_2,
            this.totalData.First_count_01,
            this.totalData.First_count_02,
            this.totalData.First_count_12,
            this.totalData.First_count_012,
            this.totalData.First_count_baozi
          ],
          [
            "最大遗漏",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            this.totalData.First_max_01,
            this.totalData.First_max_02,
            this.totalData.First_max_12,
            this.totalData.First_max_012,
            this.totalData.First_max_baozi
          ]
        ]
      };
    }
  }
};
</script>
<style lang="stylus" scoped>
.lottchart-wrapper
  margin: 30px 0

.el-table>>>.redbox
  background-color: #FF7A7E !important
  color: #fff
  font-size: 20px
  font-weight: bold

.el-table>>>.yellowbox
  @extend .el-table>>>.redbox
  background-color: #ece444 !important

.el-table>>>.bluebox
  @extend .el-table>>>.redbox
  background-color: #6985e9 !important

.el-table>>>.greenbox
  @extend .el-table>>>.redbox
  background-color: #6be76c !important

.el-table>>>.purplebox
  @extend .el-table>>>.redbox
  background-color: #C57CF5 !important

.el-table>>>.hot1
  @extend .el-table>>>.redbox
  font-weight: normal
  background-color: #63b2ff !important

.el-table>>>.hot2
  @extend .el-table>>>.redbox
  font-weight: normal
  background-color: #fe6326 !important

.el-table>>>.total
  background-color: #f5f7fa !important

.tips
  margin-top: 15px
  color: #909399
  line-height: 2

  i
    padding: 0 3px
</style>
