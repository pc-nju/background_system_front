<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>科目数目（{{total}}条）</span>
                <el-button @click="showAddView()" type="primary" size="mini" style="float: right">添加</el-button>                
            </div>
            <el-table
            :data="subjects"
            fit
            v-loading="tableLoading"
            style="width: 100%">
                <el-table-column type="index"/>
                <el-table-column prop="name" align="center" label="科目"/>
                <el-table-column prop="createTime" align="center" label="创建时间"/>
                <el-table-column fixed="right" align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showEditView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini">编辑</el-button>
                        <el-button @click="deleteSubject(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" type="danger" size="mini">删除</el-button>                    
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="40%">
            <el-form :model="subject" ref="subjectForm" :rules="rules" v-loading="formLoading">
                <el-form-item prop="name" label="科目名称">
                    <el-input v-model="subject.name" placeholder="请输入科目名称" style="width: 80%"></el-input>
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
            tableLoading: false,            
            total: 0,
            subjects: [],
            dialogTitle: '',
            dialogVisible: false,
            subject: {
                name: ''            
            },
            formLoading: false,
            rules: {
                name: [
                    { required: true, message: '必填：科目名称！', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        loadDatas () {
            var _this = this
            this.tableLoading = true
            this.getRequest("/system/subject")
            .then(resp => {
                _this.tableLoading = false
                if (resp && resp.status == 200) {
                    _this.subjects = resp.data.obj
                    _this.total = this.subjects.length
                }
            })
        },
        showAddView () {
            this.dialogVisible = true
            this.dialogTitle = '添加科目'
        },
        cancelSubject (formName) {
            this.dialogVisible = false
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
                            _this.handleResponse(_this, resp, formName)
                        })
                    } else {
                        // 插入
                        this.postRequest("/system/subject", this.subject)
                        .then(resp => {
                            _this.handleResponse(_this, resp, formName)
                        })
                    }
                } else {
                    return false
                }
            })
        },
        handleResponse (context, resp, formName) {
            context.formLoading = false
            if (resp && resp.status == 200 && resp.data.status == 200) {
                context.dialogVisible = false
                // context.$message.success(resp.data.msg)
                context.loadDatas()
                if (context.$refs[formName] !== undefined) {
                    context.$refs[formName].resetFields()
                }
                context.emptySubject()
            }
        },
        showEditView (subject) {
            this.dialogVisible = true
            this.dialogTitle = '修改科目'
            this.subject = subject
        },
        deleteSubject (subject) {
            var _this = this
            this.$confirm('删除[' + subject.name + ']科目，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableLoading = true
                this.deleteRequest("/system/subject/" + subject.id)
                .then(resp => {
                    _this.tableLoading = false
                    if (resp && resp.status == 200 && resp.data.status == 200) {
                        _this.loadDatas()
                    }
                })
            }).catch((err) => {
                this.$message('已取消删除')
            })
            
        },
        emptySubject() {
            this.subject = {
                name: ''
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
</style>
