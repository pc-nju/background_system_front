<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>科目分类</span>
                <el-button @click="showAddClassificationView" type="primary" size="mini" style="float: right">添加</el-button>                
            </div>
            <el-collapse
            v-model="activeColItem"
            @change="collapseChange"
            accordion
            v-loading="fullLoading">
                <el-collapse-item
                v-for="item in subjects"
                :key="item.id"
                :title="item.name"
                :name="item.id">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>{{item.name}}</span>
                            <div class="edit-container">
                                <el-button @click="showAddView" type="primary" size="mini">添加</el-button>                
                                <el-button @click="showEditClassificationView(item)" type="success" size="mini" round>编辑</el-button>
                                <el-button @click="deleteClassification(item.name, item.id)" type="danger" size="mini" round>删除</el-button>
                            </div>
                        </div>
                        <el-table
                        :data="childrenSubjects"
                        fit
                        v-loading="fullLoading"
                        style="width: 100%">
                            <el-table-column type="index"/>
                            <el-table-column prop="name" align="center" label="科目"/>
                            <el-table-column prop="minutes" align="center" label="1课时对应时间（分钟）"/>
                            <el-table-column fixed="right" align="center" label="操作">
                                <template slot-scope="scope">
                                    <el-button @click="showEditView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini">编辑</el-button>
                                    <el-button @click="deleteSubject(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" type="danger" size="mini">删除</el-button>                    
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </el-card>
        <el-dialog
        :title="classificationDialogTitle"
        :visible.sync="classificationDialogVisible"
        style="text-align: left"
        width="40%">
            <el-form 
            :model="subject" 
            ref="classificationForm" 
            :rules="rules" 
            v-loading="formLoading" 
            label-position="right" 
            label-width="120px">
                <el-form-item prop="name" label="科目名称">
                    <el-input v-model="subject.name" placeholder="请输入科目分类名称" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancelSubjectClassification('classificationForm')">取消</el-button>
                <el-button @click="addSubjectClassification('classificationForm')" type="primary">确定</el-button>
            </span>
        </el-dialog>        
        <el-dialog
        :title="subjectDialogTitle"
        :visible.sync="subjectDialogVisible"
        style="text-align: left"
        width="40%">
            <el-form :model="subject" ref="subjectForm" :rules="rules" v-loading="formLoading" label-position="right" label-width="120px">
                <el-form-item prop="name" label="科目名称">
                    <el-input v-model="subject.name" placeholder="请输入科目名称" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item prop="minutes" label="1课时对应时间">
                    <el-input v-model="subject.minutes" placeholder="请输入1课时对应多少分钟" style="width: 80%"></el-input>&nbsp;&nbsp;分钟
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancelSubject('subjectForm')">取消</el-button>
                <el-button @click="addSubject('subjectForm')" type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "SysSubject",
    data() {
        return {
            fullLoading: false,            
            total: 0,
            subjects: [],
            childrenSubjects: [],
            subjectDialogTitle: '',
            subjectDialogVisible: false,
            subject: {
                name: '',
                minutes: '',
                parentId: ''            
            },
            formLoading: false,
            rules: {
                name: [
                    { required: true, message: '必填：科目名称！', trigger: 'blur' }
                ],
                minutes: [
                    { required: true, message: '必填：1课时对应多长时间！', trigger: 'blur' }
                ]
            },
            activeColItem: '',
            classificationDialogTitle: '',
            classificationDialogVisible: false
        }
    },
    methods: {
        loadDatas () {
            var _this = this
            this.fullLoading = true
            this.getRequest("/system/subject/classification")
            .then(resp => {
                _this.fullLoading = false
                if (resp && resp.status == 200) {
                    _this.subjects = resp.data.obj
                }
            })
        },
        collapseChange () {
            if (this.activeColItem) {
                this.fullLoading = true
                var parentId = this.activeColItem
                this.getRequest("/system/subject/" + parentId)
                .then(resp => {
                    this.fullLoading = false
                    if (resp && resp.status == 200) {
                        this.childrenSubjects = resp.data.obj
                    }
                })                
            }
        },
        showAddClassificationView () {
            this.classificationDialogVisible = true
            this.classificationDialogTitle = '添加科目分类'
        },
        showEditClassificationView (subject) {
            this.classificationDialogVisible = true
            this.classificationDialogTitle = '修改科目分类'
            this.subject = subject
        },
        deleteClassification (subjectClassification, id) {
            this.$confirm('删除[' + subjectClassification + ']科目分类，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.fullLoading = true
                this.deleteRequest("/system/subject/classification/" + id)
                .then(resp => {
                    this.fullLoading = false
                    if (resp && resp.status == 200 && resp.data.status == 200) {
                        this.loadDatas()
                    }
                })
            }).catch((err) => {
                this.$message('已取消删除')
            })
        },
        showAddView () {
            this.subjectDialogVisible = true
            this.subjectDialogTitle = '添加科目'
        },
        cancelSubjectClassification (formName) {
            this.classificationDialogVisible = false
            this.emptySubject()
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].clearValidate()
            }
        },
        addSubjectClassification (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var _this = this
                    this.formLoading = true
                    if(this.subject.id) {
                        // 更新
                        this.putRequest("/system/subject", this.subject)
                        .then(resp => {
                            _this.handleResponse(_this, resp, formName, false)
                        })
                    } else {
                        // 插入
                        this.postRequest("/system/subject", this.subject)
                        .then(resp => {
                            _this.handleResponse(_this, resp, formName, false)
                        })
                    }
                } else {
                    return false
                }
            })
        },
        cancelSubject (formName) {
            this.subjectDialogVisible = false
            this.emptySubject()
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].clearValidate()
            }
        },
        addSubject (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var _this = this
                    this.formLoading = true
                    if(this.subject.id) {
                        // 更新
                        this.putRequest("/system/subject", this.subject)
                        .then(resp => {
                            _this.handleResponse(_this, resp, formName, true)
                        })
                    } else {
                        // 插入
                        var newSubject = {
                            name: this.subject.name,
                            minutes: this.subject.minutes,
                            parentId: this.activeColItem
                        }
                        this.postRequest("/system/subject", newSubject)
                        .then(resp => {
                            _this.handleResponse(_this, resp, formName, true)
                        })
                    }
                } else {
                    return false
                }
            })
        },
        handleResponse (context, resp, formName, isSubjectDialog) {
            context.formLoading = false
            if (resp && resp.status == 200 && resp.data.status == 200) {
                // 科目
                if (isSubjectDialog) {
                    context.subjectDialogVisible = false
                    context.collapseChange()
                } else {
                    // 科目分类
                    context.classificationDialogVisible = false
                    context.loadDatas()
                }
                if (context.$refs[formName] !== undefined) {
                    context.$refs[formName].resetFields()
                }
                context.emptySubject()
            }
        },
        showEditView (subject) {
            this.subjectDialogVisible = true
            this.subjectDialogTitle = '修改科目'
            this.subject = subject
        },
        deleteSubject (subject) {
            var _this = this
            this.$confirm('删除[' + subject.name + ']科目，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.fullLoading = true
                this.deleteRequest("/system/subject/" + subject.id)
                .then(resp => {
                    _this.fullLoading = false
                    if (resp && resp.status == 200 && resp.data.status == 200) {
                        _this.collapseChange()
                    }
                })
            }).catch((err) => {
                this.$message('已取消删除')
            })           
        },
        emptySubject() {
            this.subject = {
                name: '',
                minutes: '',
                parentId: ''
            }
        }
    },
    mounted() {
        this.loadDatas()
    },
}
</script>
<style lang="stylus" scoped>
    .box-card
        width 100%
        text-align left
        margin-top 20px
        .edit-container
            float right
</style>
