<template>
    <div>
        <div class="emp-header">
            <div class="header-left">
                <el-input 
                v-model="searchWords" 
                clearable
                :disabled="advancedSearchViewVisible"
                @keyup.enter.native="searchEmp"
                prefix-icon="el-icon-search"
                placeholder="通过员工搜索员工，记得回车哦..."
                size="mini"
                style="width: 300px;"></el-input>
                <el-button
                class="emp-btn"
                type="primary"
                size="mini"
                icon="el-icon-search"
                @click="searchEmp">搜索</el-button>
                <el-button
                class="emp-btn"
                type="primary"
                size="mini"
                slot="reference"
                @click="showAdvancedSearchView">
                    <i 
                    class="fa fa-lg" 
                    :class="this.advancedSearchViewVisible ? 'fa-angle-double-up':'fa-angle-double-down'"
                    style="margin-right: 5px;"></i>
                    高级搜索
                </el-button>
            </div>
            <div class="header-right">
                <el-upload
                :show-file-list="false"
                accept="application/vnd.ms-excel"
                action="/employee/basic/importEmp"
                :on-success="fileUploadSuccess"
                :on-error="fileUploadError"
                :disabled="fileUploadBtnText=='正在导入'"
                :before-upload="beforeFileUpload"
                style="display: inline;">
                    <el-button size="mini" type="success" :loading="fileUploadBtnText=='正在导入'">
                        <i class="fa fa-lg fa-level-up" style="margin-right:5px;"></i>
                        {{fileUploadBtnText}}
                    </el-button>
                </el-upload>
                <el-button class="emp-btn" type="success" size="mini" @click="exportEmps">
                    <i class="fa fa-lg fa-level-down" style="margin-right:5px"></i>
                    导出数据
                </el-button>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddEmpView">添加员工</el-button>
            </div>
        </div>
        <transition name="slide-fade">
            <div class="search-container" v-show="advancedSearchViewVisible">
                <div class="row-container">
                    <div class="child">
                        政治面貌：
                        <el-select v-model="emp.politicId" size="mini" placeholder="政治面貌">
                            <el-option 
                            v-for="item of politics" 
                            :key="item.id" 
                            :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div class="child">
                        民族：
                        <el-select v-model="emp.nationId" size="mini" placeholder="民族">
                            <el-option 
                            v-for="item of nations" 
                            :key="item.id" 
                            :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>                        
                    </div>
                    <div class="child">
                         聘用形式：
                        <el-radio-group v-model="emp.engageForm">
                            <el-radio label="劳动合同">劳动合同</el-radio>
                            <el-radio style="margin-left: 15px;" label="劳务合同">劳务合同</el-radio>
                        </el-radio-group>                       
                    </div>
                </div>
                <div class="row-container" style="margin-top: 10px">
                    <div>
                        入职日期：
                        <el-date-picker
                        v-model="emp.beginDateScope"
                        unlink-panels
                        size="mini"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholde="开始日期"
                        end-placeholde="结束日期"></el-date-picker>
                    </div>
                    <div>
                        <el-button size="mini" @click="cancelSearch">取消</el-button>
                        <el-button icon="el-icon-search" type="primary" size="mini" @click="advancedSearchEmp">搜索</el-button>                        
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
// 引入广播对象
import VueElement from '../../../utils/VueEvent'

export default {
    name: 'EmpHeader',
    data() {
        return {
            searchWords: '',
            advancedSearchViewVisible: false,
            fileUploadBtnText: '导入数据',
            emp: {
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: '',
                nativePlace: '',
                politicId: '',
                email: '',
                phone: '',
                address: '',
                engageForm: '',
                tipTopDegree: '',
                specialty: '',
                school: '',
                beginDate: '',
                workDate: '',
                workId: '',
                contractTerm: '',
                conversionTime: '',
                notWorkDate: '',
                beginContract: '',
                endContract: '',
                workAge: '',
                beginDateScope: ''
            }            
        }
    },
    props: {
        nations: Array,
        politics: Array
    },
    methods: {
        searchEmp () {
            // 重新请求数据
            this.normalSearch()
        },
        showAdvancedSearchView () {
            this.advancedSearchViewVisible = !this.advancedSearchViewVisible
            if (!this.advancedSearchViewVisible) {
                this.resetSearch()
            }
            // 向兄弟组件传值
            VueElement.$emit('showAdvancedSearchView', this.advancedSearchViewVisible)
        },
        cancelSearch () {
            this.showAdvancedSearchView = false            
            this.resetSearch()
        },
        advancedSearchEmp () {
            // 重新请求数据
            this.advancedSearch()
        },
        // 这三个参数是回调参数
        fileUploadSuccess (response, file, fileList) {
            if (response) {
                this.$message({
                    type: response.status == 200 ? 'success' : 'error',
                    message: response.msg
                })
            }
            // 重新请求数据
            this.normalSearch()
            this.fileUploadBtnText = '导入数据'
        },
        fileUploadError () {
            this.$message({
                type: 'error',
                message: '导入失败！'
            })
            this.fileUploadBtnText = '导入数据'
        },
        beforeFileUpload (file) {
            // 文件不能大于10M
            const isLt10M = file.size / 1024 / 1024 < 10
            if (isLt10M) {
                this.fileUploadBtnText = '正在导入'                
            } else {
                this.$message.error('上传文件大小不能超过10MB')
            }
            return isLt10M
        },
        exportEmps () {
            /**
             * window.open(URL,name,specs,replace)：open() 方法用于打开一个新的浏览器窗口或查找一个已命名的窗口。 
             * name：
             * _blank - URL加载到一个新的窗口。这是默认
             * _parent - URL加载到父框架
             * _self - URL替换当前页面
             * _top - URL替换任何可加载的框架集
             */
            window.open("/employee/basic/exportEmp", "_parent")
        },
        showAddEmpView () {},
        /**
         * 重置搜索
         */
        resetSearch () {
            this.emptyEmpData()
            this.normalSearch()
        },
        emptyEmpData () {
            this.emp = {
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: '',
                nativePlace: '',
                politicId: '',
                email: '',
                phone: '',
                address: '',
                engageForm: '',
                tipTopDegree: '',
                specialty: '',
                school: '',
                beginDate: '',
                workDate: '',
                workId: '',
                contractTerm: '',
                conversionTime: '',
                notWorkDate: '',
                beginContract: '',
                endContract: '',
                workAge: '',
                beginDateScope: ''                
            }
        },
        /**
         * 普通搜索：关键词
         */
        normalSearch () {
            this.$emit('search', false, this.searchWords)
        },
        /**
         * 高级搜索：雇员相关信息
         */
        advancedSearch () {
            this.$emit('search', true, this.emp)
        }
    },   
}
</script>
<style lang="stylus" scoped>
    .emp-header
        display flex
        justify-content space-between
        align-items center
        margin-top 10px
        .emp-btn
            margin-left 5px
        .header-left
            display inline
        .header-right
            display inline
    .search-container
        margin-bottom 10px
        border 1px solid #20a0ff
        border-radius 5px
        padding 5px 10px
        box-sizing border-box
        margin-top 10px
        .row-container
            width 100%
            display flex
            flex-flow wrap
            justify-content space-between
            .chid
                flex 0 0 33%
</style>
