<template>
  <div>
    <div class="search-container">
      <el-input
      class="search-input"
      placeholder="请输入菜单名称搜索菜单..."
      size="mini"
      prefix-icon="el-icon-search"
      v-model="keyWords"></el-input>
    </div>
    <div>
      <el-tree
      class="tree-style"
      :props="props"
      :data="treeData"
      node-key="id"
      ref="tree"
      :filter-node-method="filterNode"
      highlight-current
      :render-content="renderContent"
      v-loading="treeLoading">
      </el-tree>
      <div class="dialog-container">
        <el-dialog
        title="添加菜单"
        :visible.sync="dialogVisible"
        width="40%">
          <el-form :model="menuForm" ref="menuForm" :rules="rules" label-position="top" label-width="120px" v-loading="formLoading">
            <el-form-item prop="url" label="url拦截规则">
              <el-input size="mini" v-model="menuForm.url" placeholder="请输入url拦截规则..."></el-input>              
            </el-form-item>
            <el-form-item prop="name" label="菜单名称">
              <el-input size="mini" v-model="menuForm.name" placeholder="请输入菜单名称..."></el-input>              
            </el-form-item>
            <el-form-item prop="component" label="组件名称">
              <el-input size="mini" v-model="menuForm.component" placeholder="请输入组件名称..."></el-input>              
            </el-form-item>
            <el-form-item prop="path" label="组件路由path">
              <el-input size="mini" v-model="menuForm.path" placeholder="请输入组件路由路径..."></el-input>
            </el-form-item>
            <el-form-item label="菜单图标">
              <el-input size="mini" v-model="menuForm.iconCls" placeholder="请输入font-awesome中对应的图表类..."></el-input>              
            </el-form-item>
            <div class="check-container">
              <el-checkbox v-model="menuForm.keepAlive">长连接</el-checkbox>
              <el-checkbox v-model="menuForm.requireAuth">需要权限</el-checkbox>
            </div>
          </el-form>
          <span slot="footer">
            <el-button size="samll" @click="cancelAddMenu('menuForm')">取消</el-button>
            <el-button size="samll" type="primary" @click="addMenu('menuForm')">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MenuMana',
    data() {
      return {
        keyWords: '',
        treeLoading: false,
        treeData: [],
        props: {
          children: 'children',
          label: 'name'
        },
        dialogVisible: false,
        currentNode: {},
        currentNodeData: {},
        formLoading: false,
        menuForm: {
          url: '',
          path: '',
          component: '',
          name: '',
          iconCls: '',
          keepAlive: false,
          requireAuth: false
        },
        rules: {
          url: [
            { required: true, message: '请输入url拦截规则', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '请输入组件路由路径', trigger: 'blur' }
          ],
          component: [
            { required: true, message: '请输入组件名称', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ]                    
        }
      }
    },
    watch: {
      keyWords (val) {
        // 对树节点进行筛选操作，该参数 val 就是搜索框中的值，该值将在 filterNode (value, data) 方法中作为第一个参数
        this.$refs.tree.filter(val)
      }
    },
    mounted() {
      this.loadAllMenus()
    },
    methods: {
      loadAllMenus () {
        this.treeLoading = true
        var _this = this
        this.getRequest("/system/basic/allMenusTree")
        .then(resp => {
          _this.treeLoading = false
          if(resp && resp.status == 200) {
              _this.treeData = resp.data.obj
          }
        })
      },
      /**
       * @param node 当前节点的 Node 对象
       * @param data 当前节点的数据
       */
      renderContent (h, {node, data, store}) {
        return (
          <span style="flex:1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>{node.label}</span>
            <span>
              <el-button style="font-size: 12px; padding: 3px" type="primary" size="mini" on-click={ () => this.showAddMenuView(data,event) }>添加菜单</el-button>
              <el-button style="font-size: 12px; padding: 3px" type="danger" size="mini" on-click={ () => this.deleteMenu(node,data,event) }>删除菜单</el-button>
            </span>
          </span>
        )
      },
      /**
       * @param value this.$refs.tree.filter(val)中的参数，即搜索框中的值
       * @param data 树的数据源，即 this.treeData
       * @returns true：显示该节点 false：不显示该节点
       */
      filterNode (value, data) {
        // 若搜索框中为空，则显示所有
        if (!value) return true
        // 若搜索框中有值，则将所有节点name中包含该value值的节点显示出来
        return data.name.indexOf(value) !== -1
      },
        // data：当前节点的数据
      showAddMenuView(data,event) {
        this.dialogVisible = true
        this.currentNodeData = data
        // 阻止事件冒泡
        event.stopPropagation()
      },
        //node：当前节点的 Node 对象  data：当前节点的数据
        /**
         * 业务逻辑：
         *     找到当前节点的父节点，然后将父节点的 children[] 数组赋值一个对象，在 children[] 数组
         * 中遍历是否有 “节点的id” 与 当前节点的id 一致，若一致，返回下标，删除该下标位置的元素
         */
      deleteMenu(node,data,event) {
        var _this = this
        this.$confirm('删除[' + data.name + ']菜单，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var menuId = data.id
          _this.formLoading = true
          this.deleteRequest('/system/basic/menu/' + menuId)
          .then(resp => {
            if (resp && resp.status == 200) {
              // 删除本地视图数据源中改菜单对应的数据
              const parent = node.parent
              const children = parent.data.children || parent.data
              const index = children.findIndex(d => d.id === menuId)
              children.splice(index, 1)
            }
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        // 阻止事件冒泡
        event.stopPropagation()
      },
      addMenu (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            var parentId = this.currentNodeData.id
            var _this = this
            this.formLoading = true
            this.postRequest('/system/basic/menu', {
              url: this.menuForm.url,
              path: this.menuForm.path,
              component: this.menuForm.component,
              name: this.menuForm.name,
              iconCls: this.menuForm.iconCls,
              meta: {
                keepAlive: this.menuForm.keepAlive,
                requireAuth: this.menuForm.requireAuth
              },
              parentId: parentId
            }).then(resp => {
              _this.formLoading = false
              if (resp && resp.status == 200) {
                // 关闭dialog
                _this.dialogVisible = false

                var newMenu = resp.data.obj

                //将新增菜单数据添加为当前节点的子节点
                if (!this.currentNodeData.children) {
                  // 添加一个 children 属性
                  this.$set(this.currentNodeData, 'children', [])
                }
                this.currentNodeData.children.push(newMenu)

                // 成功以后，对表单重置，清空字段和校验结果
                _this.$refs[formName].resetFields()
              }
            })
          } else {
            return false
          }
        })
      },
      cancelAddMenu (formName) {
        this.dialogVisible = false
        this.$refs[formName].clearValidate()
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .search-container
    text-align left 
    .search-input
      width 500px
      margin 0
      padding 0
  .tree-style
    width 500px
    margin-top 10px
  .dialog-container
    text-align left
    .check-container
      display flex
      justify-content center
      margin-top 10px
</style>