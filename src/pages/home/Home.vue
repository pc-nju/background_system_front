<template>
    <div>
        <el-container class="home-container">
            <el-header class="home-header">
                <span class="header-title">后台管理系统</span>
                <div class="header-right">
                    <el-badge class="header-badge" :is-dot="showDot">
                        <i class="fa fa-bell-o" @click="goChat" style="cursor: pointer"></i>
                    </el-badge>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link header-userinfo">
                            {{user.name}}
                            <i>
                                <img class="userinfo-img" v-if="user.userface!=''" :src="user.userface" />
                            </i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>个人中心</el-dropdown-item>
                            <el-dropdown-item>设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="180px" class="home-aside">
                    <div class="aside-container">
                        <el-menu class="aside-menu" unique-opened router>
                            <template v-for="(item, index) of routes">
                                <el-submenu :key="index" :index="index + ''" v-if="!item.hidden">
                                    <template slot="title">
                                        <i :class="item.iconCls" style="color: #20a0ff;wdith: 14px;"/>
                                        <span class="item-name">{{item.name}}</span>
                                    </template>
                                    <el-menu-item 
                                    width="180px" 
                                    class="menu-item"
                                    v-for="child in item.children" 
                                    :index="child.path" 
                                    :key="child.path">
                                        {{child.name}}
                                    </el-menu-item>
                                </el-submenu>
                            </template>
                        </el-menu>
                    </div>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
                        <!-- 由于 computed 计算属性有缓存效果，所以这里不能使用计算属性 -->
                        <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
                    </el-breadcrumb>
                    <keep-alive>
                        <router-view v-if="this.$route.meta.keepAlive"></router-view>
                    </keep-alive>
                    <router-view v-if="!this.$route.meta.keepAlive"></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default {
    name: 'Home',
    data() {
        return {
            
        }
    },
    computed: {
        showDot () {
            return this.$store.state.nfDot
        },
        user () {
            return this.$store.state.user
        },
        routes () {
            return this.$store.state.routes
        }
    },
    methods: {
        goChat () {
            console.log("聊天！")
        },
        handleCommand (command) {
            var _this = this
            if (command == 'logout') {
                this.$confirm('注销登录，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 该请求会自动被后台的Spring Security 框架拦截，后台无需再处理该请求
                    _this.getRequest('/logout')
                    _this.$store.commit('logout')
                    _this.$router.replace({path: '/'})
                }).catch(() => {
                    _this.$message({
                        type: 'info',
                        message: '取消'
                    })
                })
            }
            
        }
    },
}
</script>
<style lang="stylus" scoped>
    .home-container
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        .home-header
            display flex
            align-items center
            justify-content space-between
            box-sizing content-box
            padding 0
            background-color #20a0ff
            color #333
            .header-title
                color #fff
                font-size 22px
                display inline
                margin-left 8px
            .header-right
                display flex
                align-items center
                margin-right 7px
                .header-badge
                    margin-right 30px
                .header-userinfo
                    display flex
                    align-items center
                    color #fff
                    cursor pointer
                    .userinfo-img
                        width 40px
                        height 40px
                        border-radius 40px
                        margin-right 5px
                        margin-left 5px
        .home-aside
            background-color #ececec
            .aside-container
                display flex
                justify-content flex-start
                width 100%
                text-align left
                .aside-menu
                    background-color #ececec
                    width 100%
                    .item-name
                        margin-left 4px
                    .menu-item
                        min-width 170px
                        padding-left 30px
                        padding-right 0
                        margin-left 0
                        text-align left
</style>
