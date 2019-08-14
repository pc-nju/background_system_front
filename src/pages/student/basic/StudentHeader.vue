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
                placeholder="通过学生搜索学生，记得回车哦..."
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
                action="/student/basic/importStudent"
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
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddEmpView">添加学员</el-button>
            </div>
        </div>
        <transition name="slide-fade">
            <div class="search-container" v-show="advancedSearchViewVisible">
                <div class="row-container">
                    <div>
                        科目：
                        <el-select v-model="emp.subjectIds" size="mini" multiple placeholder="选择科目">
                            <el-option 
                            v-for="item of subjects" 
                            :key="item.id" 
                            :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div>
                        开始上课日期：
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
        <el-form class="addEmp-container" :model="emp" :rules="rules" ref="addEmpForm" v-loading="formLoading">
            <div style="text-align: left">
                <el-dialog
                :title="dialogTitle"
                :close-on-click-modal="false"
                :visible.sync="dialogVisible"
                :show-close="false"
                width="77%"
                style="padding: 0">
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="学生姓名:" prop="name">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.name" size="mini" style="width: 200px" 
                                    placeholder="请输入学生姓名"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="学生年龄:" prop="age">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.age" size="mini" style="width: 200px" 
                                    placeholder="请输入学生年龄"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="学生性别:">
                                    <el-radio-group v-model="emp.gender">
                                        <el-radio label="男">男</el-radio>
                                        <el-radio label="女" style="margin-left: 15px">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="家长姓名:" prop="parentName">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.parentName" size="mini" style="width: 200px" 
                                    placeholder="请输入家长姓名"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="家长电话:" prop="parentPhone">
                                    <el-input prefix-icon="el-icon-phone" v-model="emp.parentPhone" size="mini" style="width: 200px" 
                                    placeholder="请输入家长电话"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="学生学号:" prop="idCard">
                                    <el-input v-model="emp.idCard" size="mini" style="width: 200px" placeholder="学号" 
                                    :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>                        
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="报名价格:" prop="registerPrice">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.registerPrice" size="mini" style="width: 200px" 
                                    placeholder="请输入报名价格"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="报名日期:" prop="registerDate">
                                    <el-date-picker
                                    v-model="emp.registerDate"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="报名日期"
                                    style="width: 200px"></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="报名科目:">
                                    <el-select 
                                    v-model="emp.subjectIds" 
                                    multiple 
                                    placeholder="选择报名科目" 
                                    size="mini" 
                                    style="width: 200px">
                                        <el-option
                                        v-for="item in subjects"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="开始上课:" prop="beginDate">
                                    <el-date-picker
                                    v-model="emp.beginDate"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="开始上课日期"
                                    style="width: 200px"></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8" :offset="8">
                            <div>
                                <el-form-item label="结束上课:">
                                    <el-date-picker
                                    v-model="emp.endDate"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="开始上课日期"
                                    style="width: 200px"></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <el-form-item label="学习状态:" prop="studyState">
                                    <el-switch
                                        v-model="emp.studyState"
                                        @change="handleSwitchChange"
                                        active-color="#13ce66"
                                        inactive-color="#aaaaaa"
                                        active-text="正在学习"
                                        inactive-text="暂停学习"></el-switch>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8" :offset="8">
                            <div>
                                <el-form-item :label="!emp.studyState ? '暂停上课：' : '恢复上课：'" prop="pauseDate">
                                    <el-date-picker
                                    v-model="emp.pauseDate"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    :placeholder="!emp.studyState ? '暂停上课日期' : '恢复上课日期'"
                                    style="width: 200px"
                                    :disabled="!isSwitched"></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="mini" @click="cancelEdit('addEmpForm')">取消</el-button>
                        <el-button size="mini" type="primary" @click="addEmp('addEmpForm')">确定</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-form>
    </div>
</template>
<script>
// 引入广播对象
import VueElement from '../../../utils/VueEvent'

export default {
    name: 'StudentHeader',
    data() {
        return {
            searchWords: '',
            advancedSearchViewVisible: false,
            fileUploadBtnText: '导入数据',
            emp: {
                name: '',
                age: '',
                gender: '',
                parentName: '',
                parentPhone: '',
                idCard: '',
                registerPrice: '',
                registerDate: '',
                beginDate: '',
                endDate: '',
                studyState: true,
                pauseDate: '',
                subjectIds: [],
                beginDateScope: ''
            },
            formLoading: false,
            rules: {
                name: [{required: true, message: '必填：姓名', trigger: 'blur'}],
                age: [
                    {required: true, message: '必填：年龄', trigger: 'blur'}
                ],
                gender: [{required: true, message: '必填：性别', trigger: 'blur'}],
                parentName: [{required: true, message: '必填：家长姓名', trigger: 'blur'}],
                parentPhone: [{required: true, message: '必填：家长电话号码', trigger: 'blur'}],
                registerPrice: [
                    {required: true, message: '必填：报名价格', trigger: 'blur'}
                ],
                registerDate: [{required: true, message: '必填：报名日期', trigger: 'blur'}],
                beginDate: [{required: true, message: '必填：开始上课日期', trigger: 'blur'}],
                endDate: [{required: true, message: '必填：结束上课日期', trigger: 'blur'}],
                studyState: [{required: true, message: '必填：学习状态', trigger: 'blur'}],
                pauseDate: [{required: false, message: '选填：暂停上课日期', trigger: 'blur'}]
            },
            dialogTitle: '',
            dialogVisible: false,
            isSwitched: false      
        }
    },
    props: {
        subjects: Array
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
            window.open("/student/basic/exportStudent", "_parent")
        },
        showAddEmpView () {
            // 重置 Switch 状态
            this.isSwitched = false
            this.dialogVisible = true
            this.dialogTitle = '添加学生'
        },
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
                age: '',
                gender: '',
                parentName: '',
                parentPhone: '',
                idCard: '',
                registerPrice: '',
                registerDate: '',
                beginDate: '',
                endDate: '',
                studyState: true,
                pauseDate: '',
                subjectIds: [],
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
        },
        cancelEdit (formName) {
            this.dialogVisible = false
            this.emptyEmpData()
            // 清除校验结果
            this.$refs[formName].clearValidate()
        },
        addEmp (formName) {
            var _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.formLoading = true
                    // 若id存在，则说明是更新操作
                    if (this.emp.id) {
                        this.putRequest('/student/basic/student', this.emp)
                        .then(resp => {
                            _this.handleEmpRequest(_this, resp)
                        })
                    } else {
                        this.postRequest('/student/basic/student', this.emp)
                        .then(resp => {
                            _this.handleEmpRequest(_this, resp)
                        })
                    }
                } else {
                    return false
                }
            })
        },
        /**
         * 处理添加或更新Emp之后的响应
         */
        handleEmpRequest (context, resp) {
            context.formLoading = false
            if(resp && resp.status == 200 && resp.data.status == 200) {
                context.dialogVisible = false
                context.emptyEmpData()
                context.$emit('search', false, '')            
            }
        },
        handleSwitchChange () {
            this.isSwitched = true
        }
    }, 
    /**
     * 实例创建完成之后的钩子函数
     */
    created() {
        VueElement.$on('updateEmp', data => {
            this.emp = data
            this.dialogTitle = '编辑学生'
            this.dialogVisible = true
        })        
    }      
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
    .addEmp-container
        margin 0
        padding 0
</style>
