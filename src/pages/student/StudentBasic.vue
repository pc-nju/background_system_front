<template>
    <div>
        <el-container>
            <el-header>
                <!-- 绑定子组件传递过来的时间 -->
                <v-header 
                @search="handleSearch"
                :subjects="subjects"></v-header>
            </el-header>
            <el-main style="padding-top: 0px">
                <v-body 
                @currentChange="handleCurrentChange"
                @reRequestDatas="handleReRequestDatas"
                :emps="emps" 
                :total="total"
                :subjects="subjects"></v-body>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import Header from './basic/StudentHeader'
import Body from './basic/StudentBody'

export default {
    name: "StudentBasic",
    data() {
        return {
            searchWords: '',
            emp: {},
            emps: [],
            total: -1,
            pageNum: 1,
            pageSize: 10,
            tableLoading: false,
            subjects: []
        }
    },
    mounted() {
        this.initData()
        this.loadEmps()
    },
    methods: {
        initData () {
            var _this = this
            this.getRequest("/student/basic/basicData")
            .then(resp => {
                if (resp && resp.status == 200) {
                    _this.subjects = resp.data.obj
                }
            })
        },
        loadEmps () {
            var _this = this
            this.tableLoading = true
            var beginDateScope = this.emp.beginDateScope
            if (beginDateScope && beginDateScope.length == 2) {
                beginDateScope = beginDateScope[0] + "," + beginDateScope[1]
            }
            var ids = ''
            if (this.emp.subjectIds instanceof Array && this.emp.subjectIds.length > 0) {
                this.emp.subjectIds.forEach(id => {
                    ids += id + ','
                })
                ids = ids.slice(0, ids.length-1)
            }
            this.emp.subjectIds
            var params = {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        searchWords: this.searchWords,
                        subjectIds: ids,
                        beginDateScope: beginDateScope
                    }
            this.getRequestWithParams('/student/basic/students', params)
            .then(resp => {
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    var data = resp.data.obj
                    _this.emps = data.students
                    _this.total = data.total

                }
            })
        },
        handleSearch (isAdvancedSearch, data) {
            if (isAdvancedSearch) {
                this.emp = data
            } else {
                // 重置
                this.emp = {}
                this.searchWords = data                
            }
            this.loadEmps()
        },
        handleCurrentChange (pageNum) {
            this.pageNum = pageNum
            this.loadEmps()
        },
        handleReRequestDatas () {
            this.loadEmps()
        }
    },
    components: {
        "v-header": Header,
        "v-body": Body
    }
}
</script>
<style lang="stylus" scoped>

</style>
