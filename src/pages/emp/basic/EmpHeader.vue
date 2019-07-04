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
        <el-form class="addEmp-container" :model="emp" :rules="rules" ref="addEmpForm" v-loading="formLoading">
            <div style="text-align: left">
                <el-dialog
                :title="dialogTitle"
                :close-on-click-modal="false"
                :visible.sync="dialogVisible"
                width="77%"
                style="padding: 0">
                    <el-row>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="姓名:" prop="name">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.name" size="mini" style="width: 150px" 
                                    placeholder="请输入员工姓名"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div>
                                <el-form-item label="性别:" prop="gender">
                                    <el-radio-group v-model="emp.gender">
                                        <el-radio label="男">男</el-radio>
                                        <el-radio label="女" style="margin-left: 15px">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="出生日期:" prop="birthday">
                                    <el-date-picker 
                                    v-model="emp.birthday"
                                    size="mini"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="出生日期"
                                    style="width: 150px"></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div>
                                <el-form-item label="政治面貌:" prop="politicId">
                                    <el-select v-model="emp.politicId" size="mini" placeholder="政治面貌" style="width: 200px">
                                        <el-option
                                        v-for="item in politics"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="民族:" prop="nationId">
                                    <el-select v-model="emp.nationId" size="mini" placeholder="请选择民族" style="width: 150px">
                                        <el-option
                                        v-for="item in nations"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div>
                                <el-form-item label="籍贯:" prop="nativePlace">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.nativePlace" size="mini" style="width: 150px" 
                                    placeholder="员工籍贯"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="电子邮件:" prop="email">
                                    <el-input prefix-icon="el-icon-message" v-model="emp.email" size="mini" style="width: 150px" 
                                    placeholder="电子邮箱地址..."></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div>
                                <el-form-item label="联系地址:" prop="address">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.address" size="mini" style="width: 200px" 
                                    placeholder="联系地址..."></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="电话:" prop="phone">
                                    <el-input prefix-icon="el-icon-phone" v-model="emp.phone" size="mini" style="width: 150px" 
                                    placeholder="电话号码..."></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div>
                                <el-form-item label="学历:" prop="tipTopDegree">
                                    <el-select v-model="emp.tipTopDegree" size="mini" placeholder="最高学历" style="width: 150px" >
                                        <el-option 
                                        v-for="item in degrees"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="毕业院校:" prop="school">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.school" size="mini" style="width: 150px" 
                                    placeholder="毕业院校名称"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div>
                                <el-form-item label="专业名称:" prop="specialty">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.specialty" size="mini" style="width: 200px" 
                                    placeholder="专业名称"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="入职:" prop="beginDate">
                                    <el-date-picker
                                    v-model="emp.beginDate"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="入职日期"
                                    style="width: 150px"></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div>
                                <el-form-item label="转正:" prop="conversionTime">
                                    <el-date-picker
                                    v-model="emp.conversionTime"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="转正日期"
                                    style="width: 150px"></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="合同起始:" prop="beginContract">
                                    <el-date-picker
                                    v-model="emp.beginContract"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="合同起始日期"
                                    style="width: 150px"></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div>
                                <el-form-item label="合同终止:" prop="endContract">
                                    <el-date-picker
                                    v-model="emp.endContract"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="合同起始日期"
                                    style="width: 200px"></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="身份证号码:" prop="idCard">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.idCard" size="mini" style="width: 200px" 
                                    placeholder="请输入员工身份证号码..."></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div>
                                <el-form-item label="聘用形式:" prop="engageForm">
                                    <el-radio-group v-model="emp.engageForm">
                                        <el-radio label="劳动合同">劳动合同</el-radio>
                                        <el-radio label="劳务合同">劳务合同</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div>
                                <el-form-item label="在职状态:" prop="workState">
                                    <el-radio-group v-model="emp.workState">
                                        <el-radio label="在职">在职</el-radio>
                                        <el-radio label="离职">离职</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div>
                                <el-form-item label="婚姻状况:" prop="wedlock">
                                    <el-radio-group v-model="emp.wedlock">
                                        <el-radio label="已婚">已婚</el-radio>
                                        <el-radio label="未婚">未婚</el-radio>
                                        <el-radio label="离异">离异</el-radio>
                                    </el-radio-group>
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
            },
            formLoading: false,
            degrees: [
                {id: 1, name: '小学'},
                {id: 2, name: '初中'},
                {id: 3, name: '高中'},
                {id: 4, name: '大专'},
                {id: 5, name: '本科'},
                {id: 6, name: '硕士'},
                {id: 7, name: '博士'},
                {id: 8, name: '其它'}
            ],
            rules: {
                name: [{required: true, message: '必填：姓名', trigger: 'blur'}],
                gender: [{required: true, message: '必填：性别', trigger: 'blur'}],
                birthday: [{required: true, message: '必填：出生日期', trigger: 'blur'}],
                politicId: [{required: true, message: '必填：政治面貌', trigger: 'blur'}],
                nationId: [{required: true, message: '必填：民族', trigger: 'blur'}],
                nativePlace: [{required: true, message: '必填：籍贯', trigger: 'blur'}],
                email: [
                    {required: true, message: '邮箱选填', trigger: 'blur'}, 
                    {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                ],
                address: [{required: true, message: '必填：联系地址', trigger: 'blur'}],
                phone: [{required: true, message: '必填：电话号码', trigger: 'blur'}],
                tipTopDegree: [{required: true, message: '必填：最高学历', trigger: 'blur'}],
                school: [{required: true, message: '必填：毕业院校', trigger: 'blur'}],
                specialty: [{required: true, message: '必填：专业名称', trigger: 'blur'}],
                beginDate: [{required: true, message: '必填：入职日期', trigger: 'blur'}],
                conversionTime: [{required: true, message: '必填：转正日期', trigger: 'blur'}],
                beginContract: [{required: true, message: '必填：合同起始日期', trigger: 'blur'}],
                endContract: [{required: true, message: '必填：合同终止日期', trigger: 'blur'}],
                idCard: [
                    {required: true, message: '必填：身份证号码', trigger: 'blur'},
                    {
                        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }
                ],
                engageForm: [{required: true, message: '必填：聘用形式', trigger: 'blur'}],
                workState: [{required: true, message: '必填：在职状态', trigger: 'blur'}],
                wedlock: [{required: true, message: '必填：婚姻状况', trigger: 'blur'}]
            },
            dialogTitle: '',
            dialogVisible: false            
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
        showAddEmpView () {
            this.dialogVisible = true
            this.dialogTitle = '添加员工'
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
                        this.putRequest('/employee/basic/emp', this.emp)
                        .then(resp => {
                            _this.handleEmpRequest(_this, resp)
                        })
                    } else {
                        this.postRequest('/employee/basic/emp', this.emp)
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
        }
    }, 
    /**
     * 实例创建完成之后的钩子函数
     */
    created() {
        VueElement.$on('updateEmp', data => {
            this.emp = data
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
            .chid
                flex 0 0 33%
    .addEmp-container
        margin 0
        padding 0
</style>
