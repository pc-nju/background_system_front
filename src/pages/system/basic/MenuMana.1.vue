<template>
  <div>
    <div class="container" v-loading="fullScreenLoading">
      <el-tree
      :props="props"
      :data="treeData"
      node-key="id"
      highlight-current
      show-checkbox>
        <span slot-scope="{ node, data }">
          <span>{{node.label}}</span>
          <span class="btn-container">
            <el-button
            class="custom-btn"
            type="text"
            icon="el-icon-circle-plus-outline"
            size="mini"
            @click="append(data)"
            ></el-button>
            <el-button
            class="custom-btn"
            type="text"
            icon="el-icon-remove-outline"
            size="mini"
            @click="append(data)"
            ></el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="modal-mask" v-show="isAddedMenuFormShow"></div>
    <div class="modal-dialog" v-show="isAddedMenuFormShow">
      表格
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MenuMana',
    data() {
      return {
        fullScreenLoading: false,
        treeData: [],
        props: {
          children: 'children',
          label: 'name'
        },
        isAddedMenuFormShow: false
      }
    },
    methods: {
      loadAllMenus () {
        this.fullScreenLoading = true
        var _this = this
        this.getRequest("/system/basic/allMenusTree")
        .then(resp => {
          this.fullScreenLoading = false
          if(resp && resp.status == 200) {
              _this.treeData = resp.data.obj
          }
        })
      },
        // data：当前节点的数据
      append(data) {
        this.isAddedMenuFormShow = true

        
        // const newChild = { id: id++, label: 'testtest', children: [] };
        // if (!data.children) {
        //   this.$set(data, 'children', []);
        // }
        // data.children.push(newChild);
      },
        //node：当前节点的 Node 对象  data：当前节点的数据
        /**
         * 业务逻辑：
         *     找到当前节点的父节点，然后将父节点的 children[] 数组赋值一个对象，在 children[] 数组
         * 中遍历是否有 “节点的id” 与 当前节点的id 一致，若一致，返回下标，删除该下标位置的元素
         */
      remove(node, data) {
        // const parent = node.parent;
        // const children = parent.data.children || parent.data;
        // const index = children.findIndex(d => d.id === data.id);
        // children.splice(index, 1);
      }
    },
    mounted() {
      this.loadAllMenus()
    }
  };
</script>
<style lang="stylus" scoped>
  .container
    margin-top 20px
    padding 20px
    text-align left
    width 500px
    .btn-container
      margin-left 100px
      .custom-btn
        color #f6061b
        font-size 17px
  .modal-mask
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    background-color #000
    opacity 0.1
    overflow hidden
    z-index 9000
    color #fff
  .modal-dialog
    position absolute
    top 50%
    left 50%
    width 350px
    transform translate(-50%,-55%)
    padding 35px 35px 15px 35px
    border 1px solid #eaeaea
    border-radius 15px
    background #fff
    z-index 9999
</style>