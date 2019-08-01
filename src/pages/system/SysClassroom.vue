<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>教室数目（{{total}}条）</span>
                <el-button @click="showAddView()" type="primary" size="mini" style="float: right">添加</el-button>                
            </div>
            <el-table
            :data="classrooms"
            fit
            v-loading="tableLoading"
            style="width: 100%">
                <el-table-column type="index"/>
                <el-table-column prop="name" align="center" label="教室"/>
                <el-table-column fixed="right" align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showEditView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini">编辑</el-button>
                        <el-button @click="deleteClassroom(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" type="danger" size="mini">删除</el-button>                    
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="40%">
            <el-form :model="classroom" ref="classroomForm" :rules="rules" v-loading="formLoading">
                <el-form-item prop="name" label="教室名称">
                    <el-input v-model="classroom.name" placeholder="请输入教室名称" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancelClassroom('classroomForm')">取消</el-button>
                <el-button @click="addClassroom('classroomForm')" type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "SysClassroom",
    data() {
        return {
            tableLoading: false,            
            total: 0,
            classrooms: [],
            dialogTitle: '',
            dialogVisible: false,
            classroom: {
                name: ''            
            },
            formLoading: false,
            rules: {
                name: [
                    { required: true, message: '必填：教室名称！', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        loadDatas () {
            var _this = this
            this.tableLoading = true
            this.getRequest("/system/classroom")
            .then(resp => {
                _this.tableLoading = false
                if (resp && resp.status == 200) {
                    _this.classrooms = resp.data.obj
                    _this.total = this.classrooms.length
                }
            })
        },
        showAddView () {
            this.dialogVisible = true
            this.dialogTitle = '添加教室'
        },
        cancelClassroom (formName) {
            this.dialogVisible = false
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].clearValidate()
            }
        },
        addClassroom (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var _this = this
                    this.formLoading = true
                    if(this.classroom.id) {
                        // 更新
                        this.putRequest("/system/classroom", this.classroom)
                        .then(resp => {
                            _this.handleResponse(_this, resp, formName)
                        })
                    } else {
                        // 插入
                        this.postRequest("/system/classroom", this.classroom)
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
                context.loadDatas()
                if (context.$refs[formName] !== undefined) {
                    context.$refs[formName].resetFields()
                }
                context.emptyClassroom()
            }
        },
        showEditView (classroom) {
            this.dialogVisible = true
            this.dialogTitle = '修改教室'
            this.classroom = classroom
        },
        deleteClassroom (classroom) {
            var _this = this
            this.$confirm('删除[' + classroom.name + ']教室，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableLoading = true
                this.deleteRequest("/system/classroom/" + classroom.id)
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
        emptyClassroom() {
            this.classroom = {
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
