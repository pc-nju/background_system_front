<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>校区数目（{{total}}条）</span>
                <el-button @click="showAddCampView()" type="primary" size="mini" style="float: right">添加</el-button>                
            </div>
            <el-table
            :data="campuses"
            fit
            v-loading="tableLoading"
            style="width: 100%">
                <el-table-column type="index"/>
                <el-table-column prop="name" align="center" label="校区"/>
                <el-table-column prop="address" align="center" label="地址"/>
                <el-table-column prop="phone" align="center" label="校区电话"/>
                <el-table-column fixed="right" align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showEditCampView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini">编辑</el-button>
                        <el-button @click="deleteCamp(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" type="danger" size="mini">删除</el-button>                    
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="40%">
            <el-form :model="campus" ref="campusForm" :rules="rules" v-loading="formLoading">
                <el-form-item prop="name" label="校区名称">
                    <el-input v-model="campus.name" placeholder="请输入校区名称" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="校区地址">
                    <el-input v-model="campus.address" placeholder="请输入校区地址" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="校区电话">
                    <el-input v-model="campus.phone" placeholder="请输入校区电话" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancelCampus('campusForm')">取消</el-button>
                <el-button @click="addCampus('campusForm')" type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "SysCamp",
    data() {
        return {
            tableLoading: false,            
            total: 0,
            campuses: [],
            dialogTitle: '',
            dialogVisible: false,
            campus: {
                name: '',
                address: '',
                phone: ''                
            },
            formLoading: false,
            rules: {
                name: [
                    { required: true, message: '必填：校区名称！', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '必填：校区地址！', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '必填：校区电话！', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        loadDatas () {
            var _this = this
            this.tableLoading = true
            this.getRequest("/system/campus")
            .then(resp => {
                _this.tableLoading = false
                if (resp && resp.status == 200) {
                    _this.campuses = resp.data.obj
                    _this.total = this.campuses.length
                }
            })
        },
        showAddCampView () {
            this.dialogVisible = true
            this.dialogTitle = '添加校区'
        },
        cancelCampus (formName) {
            this.dialogVisible = false
            this.$refs[formName].clearValidate()
        },
        addCampus (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var _this = this
                    this.formLoading = true
                    if(this.campus.id) {
                        // 更新
                        this.putRequest("/system/campus", this.campus)
                        .then(resp => {
                            _this.handleResponse(_this, resp, formName)
                        })
                    } else {
                        // 插入
                        this.postRequest("/system/campus", this.campus, formName)
                        .then(resp => {
                            _this.handleResponse(_this, resp)
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
                context.emptyCampus()
            }
        },
        showEditCampView (campus) {
            this.dialogVisible = true
            this.dialogTitle = '修改校区'
            this.campus = campus
        },
        deleteCamp (campus) {
            var _this = this
            this.$confirm('删除[' + campus.name + ']校区，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableLoading = true
                this.deleteRequest("/system/campus/" + campus.id)
                .then(resp => {
                    if (resp && resp.status == 200 && resp.data.status == 200) {
                        _this.loadDatas()
                    }
                })
            }).catch((err) => {
                this.$message('已取消删除')
            })
            
        },
        emptyCampus() {
            this.campus = {
                name: '',
                address: '',
                phone: ''
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
