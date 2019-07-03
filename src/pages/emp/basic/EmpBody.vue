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
            <el-table-column type="selection" align="left" width="30" />
            <el-table-column prop="name" align="left" fixed label="姓名" width="90" />
            <el-table-column prop="workId" align="left" label="工号" width="85" />
            <el-table-column prop="gender" align="left" label="性别" width="50" />
            <el-table-column align="left" label="出生日期" width="85">
                <!-- 全局过滤器的使用方式，将 scope.row.birthday 进行 formatDate()格式化 -->
                <template slot-scope="scope">{{ scope.row.birthday | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="idCard" align="left" label="身份证号" width="150" />
            <el-table-column prop="wedlock" align="left" label="婚姻状况" width="70" />
            <el-table-column prop="nation.name" align="left" label="民族" width="50" />
            <el-table-column prop="nativePlace" align="left" label="籍贯" width="80" />
            <el-table-column prop="politicsStatus.name" align="left" label="政治面貌" />
            <el-table-column prop="email" align="left" label="电子邮件" width="180" />
            <el-table-column prop="phone" align="left" label="工号" width="100" />
            <el-table-column prop="address" align="left" label="联系地址" width="200" />
            <el-table-column prop="engageForm" align="left" label="聘用形式" />
            <el-table-column prop="tipTopDegree" align="left" label="最高学历" />
            <el-table-column prop="specialty" align="left" label="专业" width="150" />
            <el-table-column prop="school" align="left" label="毕业院校" width="120" />
            <el-table-column align="left" label="入职日期" width="85">
                <template slot-scope="scope">{{scope.row.beginDate | formatDate}}</template>
            </el-table-column>
            <el-table-column align="left" label="合同期限" width="70">
                <template slot-scope="scope">{{scope.row.contractTerm}}年</template>
            </el-table-column>
            <el-table-column align="left" label="转正日期" width="85">
                <template slot-scope="scope">{{scope.row.conversionTime | formatDate}}</template>
            </el-table-column>
            <el-table-column align="left" label="合同起始日期" width="95">
                <template slot-scope="scope">{{scope.row.beginContract | formatDate}}</template>
            </el-table-column>
            <el-table-column align="left" label="合同截止日期" width="95">
                <template slot-scope="scope">{{scope.row.endContract | formatDate}}</template>
            </el-table-column>
            <el-table-column align="left" label="工龄" width="70">
                <template slot-scope="scope">{{scope.row.workAge}}年</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="195">
                <template slot-scope="scope">
                    <el-button @click="showEditEmpView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini">编辑</el-button>
                    <el-button style="padding: 3px 4px 3px 4px;margin: 2px" type="primary" size="mini">查看高级资料</el-button>
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

export default {
    name: 'EmpBody',
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
        total: Number
    },
    methods: {
        handleSelectionChange (val) {
            this.multiplySelections = val
        },
        showEditEmpView (row) {},
        deleteEmp (row) {},
        deleteBatchEmps () {},
        currentChange (currentPage) {
            this.pageNum = currentPage
            this.$emit('currentChange', this.pageNum)
        }
    },
    /**
     * 实例创建完成之后的钩子函数
     */
    created() {
        VueElement.$on('showAdvancedSearchView', data => {
            this.advancedSearchViewVisible = data
        })        
    },
}


</script>
<style lang="stylus" scoped>
    .body-footer
        display flex
        justify-content space-between
        margin-top 10px
</style>
