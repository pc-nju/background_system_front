<template>
    <div class="sysuser-container" v-loading="loading">
        <div class="header-container">
            <el-input 
            class="search-content"
            placeholder="默认展示部分用户，可以通过用户名搜索更多用户..."
            prefix-icon="el-icon-search"
            size="small"
            v-model="keyWords"></el-input>
            <el-button size="small" type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        </div>
        <div class="body-container">
            <div class="card-container" v-for="(user,index) of users" :key="user.id">
                <el-card class="user-card" v-loading="cardLoadings[index]">
                    <div slot="header" class="clearfix">
                        <span>{{user.name}}</span>
                        <el-button class="delete-button" type="text" icon="el-icon-delete" @click="deleteUser(user.id)"></el-button>
                    </div>
                    <div>
                        <div class="img-container">
                            <img class="user-img" :src="user.userface" :alt="user.name"/>
                        </div>
                        <div class="info-container">
                            <span class="user-info">用户名：{{user.name}}</span>
                            <span class="user-info">手机号码：{{user.phone}}</span>
                            <span class="user-info">电话号码：{{user.telephone}}</span>
                            <span class="user-info">地址：{{user.address}}</span>
                            <div class="user-info user-state">
                                用户状态：
                                <el-switch
                                class="switch"
                                v-model="user.enabled"
                                active-color="#13ce66"
                                inactive-color="#aaaaaa"
                                active-text="启用"
                                inactive-text="禁用"
                                :key="user.id"
                                @change="switchChange(user.enabled,user.id,index)">
                                </el-switch>
                            </div>
                            <div class="user-info">
                                用户角色：
                                <el-tag
                                class="role-tag"
                                v-for="role of user.roles"
                                :key="role.id"
                                type="success"
                                size="mini"
                                :disable-transitions="false">
                                    {{role.nameZh}}
                                </el-tag>
                                <el-popover
                                v-loading="epLoadings[index]"
                                placement="right"
                                title="角色列表"
                                width="200"
                                trigger="click"
                                @hide="updateUserRoles(user.id,index)">
                                    <el-select 
                                    v-model="selectedRoles"
                                    multiple
                                    placeholder="请选择角色">
                                        <el-option
                                        v-for="ar in allRoles"
                                        :key="ar.id"
                                        :label="ar.nameZh"
                                        :value="ar.id">
                                        </el-option>
                                    </el-select>
                                    <!-- slot="reference"：触发 popover -->
                                    <el-button class="more-button" type="text" icon="el-icon-more" slot="reference" 
                                    @click="loadSelectedRoles(user.roles,index)" :disabled="moreBtnState"></el-button>
                                </el-popover>
                            </div>
                            <span class="user-info">描述：{{user.remark}}</span>
                        </div>
                    </div>
                </el-card>                
            </div>
        </div>
        <div class="foot-container">
            <el-pagination
            background
            :page-size="pageSize"
            :current-page="pageNum"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :page-count="7"
            :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: "SysUser",
    data() {
        return {
            loading: false,
            keyWords: '',
            pageNum: 1,
            pageSize: 6,
            total: 0,
            users: [],
            allRoles: [],
            // 用户卡片加载状态数组
            cardLoadings: [],
            // 角色pop框加载状态数组
            epLoadings: [],
            //本次选中的角色数组
            selectedRoles: [],
            //没选择角色之前，该用户所拥有的的角色
            oldRoles: [],
            // 是否禁用“更多”按钮
            moreBtnState: false,
            currentPage: 1
        }
    },
    methods: {
        /**
         * @param keyWords 搜索词
         * @param pageNum 请求页
         */
        search (keyWords, pageNum) {
            this.loading = true
            var _this = this
            var searchWords
            if (this.keyWords === '') {
                searchWords = 'all'
            } else {
                searchWords = this.keyWords
            }
            this.getRequestWithParams('/system/user/' + searchWords, {
                pageNum: pageNum,
                pageSize: this.pageSize
            }).then(resp => {
                _this.loading = false
                if(resp && resp.status == 200) {
                    _this.users = resp.data.obj.users
                    _this.total = resp.data.obj.total
                    var length = resp.data.obj.users.length
                    // 下面其实就是构造一个length长度的数组：[false, false, false...]
                    _this.cardLoadings = Array(null, Array(length)).map(function (item, i) {
                        return false
                    })
                    _this.epLoadings = Array(null, Array(length)).map(function (item, i) {
                        return false
                    })
                }
            })
            // this.getRequestWithParam('/system/user/' + searchWords, {
                // pageNum: pageNum,
                // pageSize: this.pageSize
            // }).then(resp => {

            // })
        },
    
        searchClick () {
            this.search(this.keyWords, 1)
        },
        initUserCards () {
            this.search(this.keyWords, 1)
        },
        loadAllRoles () {
            var _this = this
            this.getRequest("/system/basic/roles")
            .then(resp => {
                if (resp && resp.status == 200) {
                    _this.allRoles = resp.data.obj
                }
            })
        },
        deleteUser (userId) {
            var _this = this
            this.loading = true
            this.deleteRequest("/system/user/" + userId)
            .then(resp => {
                _this.loading = false
                // 若删除成功，重新请求数据
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    _this.initUserCards()
                }
            })
        },
        switchChange(enabled,userId,index) {
            // 该用户卡片对应的进度条状态设置为true
            this.cardLoadings.splice(index, 1, true)
            var _this = this
            this.putRequest('/system/user/', {
                id: userId,
                enabled: enabled
            }).then(resp => {
                _this.cardLoadings.splice(index, 1, false)
                if (resp && resp.status == 200) {
                    // 若更新失败，则请求更新前的数据（因为我们已经点击了switch，界面已经变化，只有把数据更换成更新前的数据，界面才会正常）
                    if (resp.data.status == 500) {
                        _this.refreshUser(userId,index)
                    }
                } else {
                    _this.refreshUser(userId,index)
                }
            })
        },
        refreshUser (userId,index) {
            this.cardLoadings.splice(index, 1, true)
            var _this = this
            this.getRequest("/system/user/id/" + userId)
            .then(resp => {
                this.cardLoadings.splice(index, 1, false)
                if (resp && resp.status == 200) {
                    var user = resp.data.obj
                    // 将该位置的用户数据更新为请求来的数据
                    _this.users.splice(index, 1, user)
                }
            })
        },
        updateUserRoles (userId,index) {
            //更多按钮可用
            this.moreBtnState = false
            //判断角色是否有变化，有变化则更新到后台；无变化，就不用
            //依靠记录的 “选择前角色集合” 和 “选择后角色集合” 来判断有无变化
            if (this.selectedRoles.length == this.oldRoles.length) {
                for (let i = 0; i < this.selectedRoles.length; i++) {
                    for (let j = 0; j < this.oldRoles.length; j++) {
                        if (this.selectedRoles[i] == this.oldRoles[j]) {
                            this.oldRoles.splice(j,1)
                            break
                        }
                    }
                    // 若完整遍历 this.oldRoles 一次之后，长度依然相等，说明this.selectedRoles第i个元素
                    // 和this.oldRoles集合中的元素没一个相等的,说明有变化，直接中断循环
                    if (this.selectedRoles.length == this.oldRoles.length) {
                        break
                    }
                }
            }
            //若完全一致，则说明无变化，直接返回即可
            if (this.oldRoles.length == 0) {
                return
            }
            // 若执行到这一步，说明有变化，执行更新

            this.epLoadings.splice(index, 1, true)
            var _this = this
            this.putRequest("/system/user/roles", {
                userId: userId,
                roleIds: this.selectedRoles
            }).then(resp => {
                _this.epLoadings.splice(index, 1, false)
                // 若更新成功，刷新数据，将新的角色展示出来（否则显示的还是旧的角色）
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    _this.refreshUser(userId,index)
                }
            })
        },
        loadSelectedRoles(roles,index) {
            this.moreBtnState = true
            this.selectedRoles = []
            this.oldRoles = []
            roles.forEach(role => {
                // 因为 <el-select>的,<el-option>的绑定值是id：:value="ar.id"
                this.selectedRoles.push(role.id)
                this.oldRoles.push(role.id)
            })
        },
        handleCurrentChange (currentPage) {
            // 因为 currentPage 已经与 this.pageNum绑定了，所以我们不用再给其赋值
            this.search(this.keyWords, currentPage)
        }
    },
    mounted() {
        this.initUserCards()
        this.loadAllRoles()
    },
}
</script>
<style lang="stylus" scoped>
    .sysuser-container
        margin-top 10px
        .header-container
            display flex
            justify-content center
            align-items center
            margin-bottom 20px
            .search-content
                width 400px
                margin-right 10px
        .body-container
            display flex
            justify-content space-around
            // 当前行不足以容纳所有元素时，进行换行
            flex-wrap wrap
            text-align left
            width 100%
            .card-container
                flex 0 0 33%
                display flex
                justify-content center
                .user-card
                    width 350px
                    margin-bottom 20px
                    .delete-button
                        float right
                        padding 3px 0
                        margin 0
                        width 15px
                        height 15px
                        color #f6061b
                    .img-container
                        display flex
                        justify-content center
                        width 100%
                        .user-img
                            width 70px
                            height 70px
                            border-radius 70px
                    .info-container
                        margin-top 20px
                        display flex
                        flex-direction column
                        .user-info
                            font-size 14px
                            color #09c0f6
                            .role-tag
                                margin-right 5px
                            .more-button
                                color #09c0f6
                                padding-top 0px
                        .user-state
                            display flex
                            align-items center
                            margin-bottom 3px
                            .switch
                                display inline
                                margin-left 5px
        .foot-container
            display flex
            justify-content center
            margin-top 10px
</style>
