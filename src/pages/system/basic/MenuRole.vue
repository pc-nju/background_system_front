<template>
    <div>
        <div class="menurole-header" v-loading="loading">
            <el-input 
            class="input-left"
            placeholder="请输入角色英文名称..."
            size="mini"
            v-model="newRole">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input 
            class="input-right"
            placeholder="请输入角色中文名字..."
            size="mini"
            v-model="newRoleZh"></el-input>
            <el-button class="add-button" type="primary" size="mini" @click="addNewRole">添加角色</el-button>
        </div>
        <div class="menurole-body">
            <el-collapse class="body-collapse" v-model="activeColItem" accordion @change="collapseChange(activeColItem)">
                <!-- :name="item.id"：就是 collapseChange(activeName) 中的activeName，属于 Element-UI collapse控件的回调函数 -->
                <el-collapse-item v-for="(item, index) of roles" :key="item.name" :title="item.nameZh" :name="item.id">
                    <el-card class="box-card">
                        <div slot="header">
                            <span>可访问的资源</span>
                            <el-button class="delete-button" type="text" icon="el-icon-delete" @click="deleteRole(item.id, item.nameZh)"></el-button>
                        </div>
                        <div>
                            <el-tree :props="props"
                            :data="treeData"
                            :default-checked-keys="checkedKeys"
                            node-key="id"
                            ref="tree"
                            show-checkbox
                            highlight-current
                            @check-change="handleCheckChange"></el-tree>
                        </div>
                        <div class="card-footer">
                            <el-button size="mini" @click="cancelUpdateRoleMenu">取消修改</el-button>
                            <el-button type="primary" size="mini" @click="updateRoleMenu(index)">确认修改</el-button>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script>
import { isNotNullOrBlank } from "../../../utils/utils"
export default {
    name: "MenuRole",
    data() {
        return {
            loading: false,
            newRole: '',
            newRoleZh: '',
            roles: [],
            activeColItem: -1,
            treeData: [],
            checkedKeys: [],
            props: {
                children: 'children',
                label: 'name'
            }
        }
    },
    mounted() {
        this.loading = true
        this.initRoles()
    },
    methods: {
        initRoles() {
            var _this = this
            this.getRequest("/system/basic/roles")
            .then(resp => {
                _this.loading = false
                if(resp && resp.status == 200) {
                    _this.roles = resp.data.obj
                    // 恢复折叠状态
                    _this.activeColItem = -1
                }
            })
        },
        addNewRole () {
            if (isNotNullOrBlank(this.newRole, this.newRoleZh)) {
                this.loading = true
                var _this = this
                this.postRequest('/system/basic/addRole', {
                    name: this.newRole,
                    nameZh: this.newRoleZh
                }).then(resp => {
                    _this.loading = false
                    if (resp && resp.status == 200) {
                        _this.initRoles()
                        _this.newRole = ''
                        _this.newRoleZh = ''
                    }
                })
            }
        },
        collapseChange (activeName) {
            // 点击时，会获取每个item绑定的 name，而这里的 name 就是roleId
            var roleId = activeName
            if (activeName == '') {
                return
            }
            var _this = this
            this.getRequest("/system/basic/menuTree/" + roleId)
            .then(resp => {
                if(resp && resp.status == 200) {
                    var data = resp.data.obj
                    _this.treeData = data.menus
                    _this.checkedKeys = data.menuIds
                }
            })
        },
        deleteRole(roleId, roleNameZh) {
            var _this = this
            this.$confirm('删除角色[' + roleNameZh + ']，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.loading = true
                _this.deleteRequest('/system/basic/role/' + roleId)
                .then(resp => {
                    _this.loading = false
                    if(resp && resp.status == 200) {
                        _this.initRoles()
                    }
                })
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        handleCheckChange (data, checked, indeterminate) {},
        cancelUpdateRoleMenu () {
            // 恢复到折叠状态
            this.activeColItem = -1
        },
        // 有多少个角色就有多少个树
        updateRoleMenu (index) {
            // getCheckedKeys(true)：表示只返回被选中的叶子结点的keys。由于我们设置了 node-key="id"，
            // 也就是数据源中的menu的id，所以这里能获取到所有被选中菜单的id集合
            var checkedKeys = this.$refs.tree[index].getCheckedKeys(true)
            var _this = this
            this.putRequest("/system/basic/updateMenuRole", {
                roleId: this.activeColItem,
                menuIds: checkedKeys
            }).then(resp => {
                if(resp && resp.status == 200) {
                    // 恢复折叠状态
                    _this.activeColItem = -1
                }
            })
        }
    },
}
</script>
<style lang="stylus" scoped>
    .menurole-header
        display flex
        align-items center
        text-align left
        .input-left
            width 250px
        .input-right
            width 250px
            margin-left 5px
        .add-button
            margin-left 5px
    .menurole-body
        text-align left 
        margin-top 10px
        .body-collapse
            width 500px
            .delete-button
                float right 
                color #f6061b
                margin 0
                padding 3px 0
                width 15px
                height 15px
            .card-footer
                display flex
                justify-content flex-end
                margin-right 10px
                margin-top 10px
</style>