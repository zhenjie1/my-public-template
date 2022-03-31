<template>
  <div>
    <!-- <div @click="getList123">1111111</div> -->
    <a-checkbox
      v-if="constructData && constructData.length > 0"
      v-model:checked="allChecked"
      style="margin-bottom: 20px"
      @change="listenAllChecked"
    />
    全选

    <table>
      <tr>
        <th>菜单</th>
        <th>按钮</th>
      </tr>
      <tr v-for="(row, rowIndex) in table" :key="rowIndex" v-show="row.isShow">
        <td>
          <!-- <span @click="expendclick">{{ filterLevel }}</span> -->
          <span
            @click="isExpandClick(row)"
            v-show="row.isMenu && row.children.length > 0"
          >
            <PlusCircleOutlined v-show="!row.expand" />
            <MinusCircleOutlined v-show="row.expand" />
          </span>
          <span
            style="display: inline-block"
            v-html="filterLevel(row.title, row.level)"
          ></span>
          <a-checkbox
            v-model:checked="row.checked"
            :indeterminate="row.preChecked"
            @change="onClickBtnChecked(row)"
            style="margin-left: 10px"
          />
        </td>
        <td
          v-if="
            row.children && row.children.length > 0 && !row.children[0].isMenu
          "
        >
          <span
            v-for="(child, childIndex) in row.children"
            :key="childIndex + 'child'"
            class="child"
          >
            <a-checkbox
              v-model:checked="child.checked"
              :indeterminate="child.preChecked"
              @change="onClickBtnChecked(child)"
            />
            {{ child.title }}
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script  lang="ts">
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons-vue";
/**
 * 层级即时单元格个数、行数则最后row的总和
 */
const resData = [
  {
    title: "系统管理",
    id: 1,
    pid: 0,
    isMenu: true,
    children: [
      {
        title: "角色分配",
        id: 11,
        pid: 1,
        isMenu: true,
        children: [
          {
            title: "角色分配1",
            id: 111,
            pid: 11,
            isMenu: true,
            children: [
              { title: "删除", isMenu: false, id: 1111, pid: 111 },
              { title: "详情", isMenu: false, id: 1112, pid: 111 },
              { title: "添加", isMenu: false, id: 1113, pid: 111 },
            ],
          },
          { title: "角色分配2", isMenu: true, id: 112, pid: 11 },
          { title: "角色分配3", isMenu: true, id: 113, pid: 11 },
        ],
      },
      {
        title: "总部分配",
        id: 12,
        pid: 1,
        isMenu: true,
        children: [
          { title: "总部分配1", isMenu: true, id: 121, pid: 12 },
          { title: "总部分配2", isMenu: true, id: 122, pid: 12 },
          { title: "总部分配3", isMenu: true, id: 123, pid: 12 },
        ],
      },
      {
        title: "权限分配",
        isMenu: true,
        id: 13,
        pid: 1,
      },
    ],
  },
  {
    title: "活动管理",
    id: 2,
    pid: 0,
    isMenu: true,
    children: [
      { title: "活动1", isMenu: true, id: 21, pid: 2 },
      { title: "活动2", isMenu: true, id: 22, pid: 2 },
      { title: "活动3", isMenu: true, id: 23, pid: 2 },
    ],
  },
  {
    title: "积分管理",
    isMenu: true,
    id: 3,
    pid: 0,
  },
];
export default {
  components: {
    PlusCircleOutlined,
    MinusCircleOutlined,
  },
  data() {
    return {
      allChecked: false,
      constructData: [],
      flatConstructData: [], // 扁平化数据
      maxLevel: 0, // 获取最大层级
      table: [],
    };
  },
  mounted() {
    // 第一步转换数据格式
    this.switchData(resData, 0);
    // 第二部绑定数据
    this.constructData = resData;
    // 第三步扁平化数据
    this.flatConstructData = this.platFn(resData);
    // 第四步获取最大层级
    // this.maxLevel = this.getMaxLevel()
    // 第五步，计算层最底层开始，得row
    // this.computeRow()
    // 最后一步构造表格
    this.constructTable();
  },
  methods: {
    checkList() {
      let arr = [];
      this.flatConstructData.forEach((item) => {
        if (item.checked) {
          arr.push(item.id);
        }
      });
      console.log(arr);
      localStorage.setItem("checkListId", arr);
    },
    filterLevel(c, level) {
      return `<span style="padding-left:${
        level * 20
      }px; display:inline-block;">${c}</span>`;
    },
    /**
     * @Tag 功能权限
     * @desc
     */

    expendclick() {},
    // 全选功能
    listenAllChecked() {
      console.log(this.allChecked);
      this.selectMenuData(this.constructData, this.allChecked);
      this.checkList();
    },
    /**
     * @desc 验证是否全选
     */
    validateIsAllChecked() {
      this.allChecked = this.constructData.every((element) => element.checked);
      this.checkList();
    },

    /**
     * @Tag 功能权限
     * @desc 应用于全选功能
     */
    selectMenuData(list, status) {
      console.log(status);
      if (Array.isArray(list)) {
        // console.log(list)

        list.forEach((element) => {
          element.checked = status;
          element.preChecked = false;
          // this.$set(element, 'checked', status)
          // this.$set(element, 'preChecked', false)
          if (element.isMenu && element.children.length > 0) {
            this.selectMenuData(element.children, status);
          }
        });
      }
    },
    constructTable() {
      this.table = this.setRowData(this.constructData);
    },
    /**
     * 转换成表格行
     */
    setRowData(data) {
      let arr = [];
      if (data && data.length > 0) {
        data.forEach((v) => {
          arr.push(v);
          if (v.isMenu && v.children.length > 0 && v.children[0].isMenu) {
            arr = arr.concat(this.setRowData(v.children));
          }
        });
      }
      return arr;
    },
    /**
     * 计算所占行数
     */
    // computeRow () {
    //   if (this.maxLevel > 0) {
    //     for (let i = this.maxLevel + 1; --i; i > 1) {
    //       this.flatConstructData.forEach((flat) => {
    //         if (flat.level === i) {
    //           if (flat.isMenu) {
    //             if ((flat.row < 1) && (!flat.end)) {
    //               flat.row = flat.children.reduce((total, item) => { return total + item.row }, 0)
    //             }
    //           } else {

    //           }
    //         }
    //       })
    //     }
    //   }
    // },
    /**
     * @desc 获取最大层级，弃用
     */
    getMaxLevel() {
      let max = 0;
      this.flatConstructData.forEach((f) => {
        if (f.level > max) {
          max = f.level;
        }
      });
      return max;
    },
    /*
     * @输入参数 list: 需要扁平化的树形结构数组，默认按children字段扁平展开
     * @输出：返回别扁平化的数组
     */
    platFn(list) {
      let res = [];
      res = list.concat(
        ...list
          .map((item) => {
            if (
              item.children &&
              Array.isArray(item.children) &&
              item.children.length > 0
            ) {
              return this.platFn(item.children);
            }
            return null;
          })
          .filter((o) => Array.isArray(o) && o.length > 0)
      );
      return res;
    },
    isExpandClick(row) {
      row.expand = !row.expand;

      this.setExpandChild(row.children, row.expand);
    },

    setExpandChild(child, status) {
      if (child.length > 0 && child[0].isMenu) {
        child.forEach((item) => {
          item.isShow = status;
          if (item.isMenu && item.children.length > 0) {
            this.setExpandChild(item.children);
          }
        });
      }
    },
    /**
     * @desc 转换数据格式，设定checked选中、preChecked部分选中、level层级
     */
    switchData(data, level) {
      if (data && data.length > 0) {
        data.forEach((element) => {
          element.checked = false;
          element.preChecked = false;
          element.expand = true;
          element.isShow = true;
          if (element.isMenu) {
            element.level = level + 1;
            if (
              element.hasOwnProperty("children") &&
              element.children.length > 0
            ) {
              // 如果最后子集有一个不是菜单，也是到头了
              if (!element.children[0].isMenu) {
                element.children.map((v) => {
                  v.level = element.level + 1;
                });
                element.end = true;
                element.row = 1;
              } else {
                element.row = 0;
              }
              this.switchData(element.children, element.level);
            } else {
              element.children = [];
              // 如果没有了子集，那也到头了
              element.end = true;
              element.row = 1;
            }
          }
        });
      }
    },
    /**
     * @Tag 功能权限
     * @desc 判断所有按钮是否已全选
     */
    onClickBtnChecked(item) {
      // 向上查找判断
      this.setAllParent(item.id);
      item.preChecked = false;
      // this.$set(item, 'preChecked', false)
      // 向下查找判断
      const downFunc = (itArr) => {
        itArr.forEach((element) => {
          // this.$set(element, 'checked', item.checked)
          // this.$set(element, 'preChecked', false)
          element.checked = item.checked;
          element.preChecked = false;
          if (element.isMenu && element.children.length > 0) {
            downFunc(element.children);
          }
        });
      };
      if (item.isMenu && item.children.length > 0) {
        downFunc(item.children);
      }
      this.validateIsAllChecked();
    },
    // 向上查找所有父级，并设置全选的状态, 注意自身节点所在层级不做设置
    /**
     * @param: id, 当前节点的id, 想要设置的层级
     */
    setAllParent(id) {
      let result = this.getParent(this.constructData, id); // 获取上层所有父级
      result = result || [];
      console.log(result);
      if (result.length > 1) {
        for (let i = result.length - 2; i >= 0; i--) {
          // 减2是去除节点所在层级结果
          // 层级从倒数第二层开始判断
          result[i].checked =
            result[i].children.length > 0
              ? result[i].children.every((child) => child.checked)
              : false;

          // 对半选状态的设置start
          let bool = false;
          if (result[i].children.length > 0) {
            if (result[i].children.every((child) => child.checked)) {
              bool = false;
            } else if (
              result[i].children.some(
                (child) => child.preChecked || child.checked
              )
            ) {
              bool = true;
            }
          }
          // console.log(bool, result[i].permission_name, i)
          // this.$set(result[i], 'preChecked', bool)
          result[i].preChecked = bool;
          // 对半选状态的设置end
        }
      }
      // this.$forceUpdate()
    },
    /**
     * @desc 通过传入当前节点某个值(如id)，查询所有父级节点
     */
    getParent(data2, nodeId2) {
      let arrRes = [];
      if (data2.length === 0) {
        if (nodeId2) {
          arrRes.unshift(data2);
        }
        return arrRes;
      }
      const rev = (data, nodeId) => {
        for (let i = 0, length = data.length; i < length; i++) {
          const node = data[i];
          if (node.id === nodeId) {
            arrRes.unshift(node);
            // 查找到当前id,继续追随父级id
            rev(data2, node.pid); // 注意这里是传入的tree，不要写成data了，不然遍历的时候一直都是node.children,不是从最顶层开始遍历的
            break;
          } else {
            // 如果当前节点没有对应id,则追溯该子类是否有匹配项
            // eslint-disable-next-line no-lonely-if
            if (node.children) {
              rev(node.children, nodeId);
            }
          }
        }
        return arrRes;
      };
      arrRes = rev(data2, nodeId2);
      console.log("111111111111111", arrRes);
      return arrRes;
    },
  },
};
</script>

<style lang="scss" scoped>
$borderColor: #b5bdc5;
.box {
  display: flex;
  flex-direction: column;
  &-item {
    display: flex;
    &-td {
      padding: 10px;
    }
  }
}
table {
  width: 800px;
  tr {
    border: 1px solid $borderColor;
    th {
      background: #fafafa;
      border: 1px solid $borderColor;
      padding: 10px;
    }
    td {
      border: 1px solid #b5bdc5; /* 单元格边框 */
      text-align: left;
      padding: 5px 10px;
      .child {
        margin-left: 10px;
      }
    }
  }
}
</style>
