<template>
    <div>
        <el-container>
            <el-header>
                <!-- 绑定子组件传递过来的时间 -->
                <v-header 
                @search="handleSearch"
                :nations="nations" 
                :politics="politics"></v-header>
            </el-header>
            <el-main style="padding-top: 0px">
                <v-body 
                 @currentChange="handleCurrentChange"
                :emps="emps" 
                :total="total"></v-body>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import Header from './basic/EmpHeader'
import Body from './basic/EmpBody'

export default {
    name: "EmpBasic",
    data() {
        return {
            searchWords: '',
            emp: {},
            emps: [],
            total: -1,
            pageNum: 1,
            pageSize: 10,
            tableLoading: false,
            nations: [],
            politics: []
        }
    },
    mounted() {
        this.initData()
        this.loadEmps()
    },
    methods: {
        initData () {
            var _this = this
            this.getRequest("/employee/basic/basicData")
            .then(resp => {
                if (resp && resp.status == 200) {
                    var data = resp.data.obj
                    _this.nations = data.nations
                    _this.politics = data.politics
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
            var params = {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        searchWords: this.searchWords,
                        politicId: this.emp.politicId,
                        nationId: this.emp.nationId,
                        engageForm: this.emp.engageForm,
                        beginDateScope: beginDateScope
                    }
            this.getRequestWithParams('/employee/basic/emps', params)
            .then(resp => {
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    var data = resp.data.obj
                    _this.emps = data.employees
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
