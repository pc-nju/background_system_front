<template>
    <div>
        <!-- 给高级搜索视图的显示创造空间 -->
        <div v-if="advancedSearchViewVisible" style="height: 75px; width: 100%"></div>     
        <el-table 
        :data="emps" 
        border
        stripe
        @selection-change="handleSelectionChange"
        size="mini"
        style="width: 100%"
        v-loading="tableLoading">
            <el-table-column type="selection" align="center" width="30" />
            <el-table-column prop="name" align="center" fixed label="姓名" width="90" />
            <el-table-column prop="idCard" align="center" label="学号" width="150" />
            <el-table-column prop="age" align="center" label="年龄" width="85" />
            <el-table-column prop="gender" align="left" label="性别" width="50" />
            <el-table-column prop="parentName" align="center" label="家长姓名" width="90" />
            <el-table-column prop="parentPhone" align="center" label="家长电话" width="100" />

            <el-table-column align="center" label="报名科目" width="200">
                <template slot-scope="scope">{{scope.row.subjectIds | translate2SubjectNames}}</template>
            </el-table-column>

            <el-table-column prop="registerPrice" align="center" label="报名价格" width="100" />
            <el-table-column align="center" label="报名日期" width="85">
                <!-- 全局过滤器的使用方式，将 scope.row.birthday 进行 formatDate()格式化 -->
                <template slot-scope="scope">{{scope.row.registerDate | formatDate}}</template>
            </el-table-column>
            <el-table-column align="center" label="开始上课日期" width="120">
                <template slot-scope="scope">{{scope.row.beginDate | formatDate}}</template>
            </el-table-column>
            <el-table-column align="center" label="结束上课日期" width="120">
                <template slot-scope="scope">{{scope.row.endDate | formatDate}}</template>
            </el-table-column>
            <el-table-column align="center" label="学习状态" width="200">
                <template slot-scope="scope">
                    <el-switch
                        class="switch"
                        v-model="scope.row.studyState"
                        active-color="#13ce66"
                        inactive-color="#aaaaaa"
                        active-text="正在学习"
                        inactive-text="暂停学习"
                        :disabled="true"></el-switch>                    
                </template>
            </el-table-column>
            <el-table-column align="center" label="暂停上课日期" width="120">
                <template slot-scope="scope">{{scope.row.pauseDate | formatDate}}</template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="showEditEmpView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini">编辑</el-button>
                    <el-button @click="deleteEmp(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="body-footer">
            <el-button 
            type="danger" 
            size="mini" 
            v-if="emps.length>0" 
            :disabled="multiplySelections.length==0"
            @click="deleteBatchEmps">批量删除</el-button>
            <el-pagination 
            background
            :page-size="pageSize"
            :current-page="pageNum"
            @current-change="currentChange"
            layout="total, prev, pager, next"
            :total="total"></el-pagination>
        </div>
        
    </div>
</template>
<script>
// 引入广播对象
import VueElement from '../../../utils/VueEvent'

// 全局变量
var app0

export default {
    name: 'StudentBody',
    data() {
        return {
            advancedSearchViewVisible: false,
            tableLoading: false,
            multiplySelections: [],
            pageNum: 1,
            pageSize: 10
        }
    },
    props: {
        emps: Array,
        total: Number,
        subjects: Array
    },
    methods: {
        handleSelectionChange (val) {
            this.multiplySelections = val
        },
        showEditEmpView (row) {
            if (row.registerDate) {
                row.registerDate = this.formatDate(row.registerDate)
            }
            if (row.beginDate) {
                row.beginDate = this.formatDate(row.beginDate)
            }
            if (row.endDate) {
                row.endDate = this.formatDate(row.endDate)
            }
            if (row.pauseDate) {
                row.pauseDate = this.formatDate(row.pauseDate)
            }
            // 目的：数据拷贝，防止数据变动产生相互影响
            const emp = {
                id: row.id,
                name: row.name,
                age: row.age,
                gender: row.gender,
                parentName: row.parentName,
                parentPhone: row.parentPhone,
                idCard: row.idCard,
                registerPrice: row.registerPrice,
                registerDate: row.registerDate,
                beginDate: row.beginDate,
                endDate: row.endDate,
                studyState: row.studyState,
                pauseDate: row.pauseDate,
                subjectIds: row.subjectIds                
            }
            VueElement.$emit('updateEmp', emp)
        },
        deleteEmp (row) {
            this.$confirm('此操作将永久删除[' + row.name + ']信息，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.doDelete(row.id) 
            }).catch((err) => {
                this.$message('已取消')
            })
        },
        deleteBatchEmps () {
            this.$confirm('此操作将永久删除[' + this.multiplySelections.length + ']条数据，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               var ids = ''
               this.multiplySelections.forEach(emp => {
                   ids += emp.id + ','
               })
               // 去掉末尾的逗号：,
               this.doDelete(ids.slice(0, ids.length-1))
            }).catch((err) => {
                this.$message('已取消')
            })
        },
        doDelete(ids) {
            this.tableLoading = true
            var _this = this
            this.deleteRequest('/student/basic/students/' + ids)
            .then(resp => {
                _this.tableLoading = false
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    _this.$emit('reRequestDatas')
                }
            })
        },
        currentChange (currentPage) {
            this.pageNum = currentPage
            this.$emit('currentChange', this.pageNum)
        }
    },
    beforeCreate() {
        app0 = this
    },
    /**
     * 实例创建完成之后的钩子函数
     */
    created() {
        VueElement.$on('showAdvancedSearchView', data => {
            this.advancedSearchViewVisible = data
        })        
    },
    filters: {
        translate2SubjectNames (subjectIds) {
            var tempSubjects = {}
            app0.subjects.forEach(subject => {
                tempSubjects[subject.id] = subject.name
            })
            var resultStr = ''
            if (subjectIds instanceof Array && subjectIds.length > 0) {
                subjectIds.forEach(id => {
                    resultStr += tempSubjects[id] + '/'
                })
                resultStr = resultStr.slice(0, resultStr.length - 1)
            }
            return resultStr
        }
    }
}


</script>
<style lang="stylus" scoped>
    .body-footer
        display flex
        justify-content space-between
        margin-top 10px
</style>
