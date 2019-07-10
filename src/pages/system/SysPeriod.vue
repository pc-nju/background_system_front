<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>时间段数目（{{total}}条）</span>
                <el-button @click="showAddView()" type="primary" size="mini" style="float: right">添加</el-button>                
            </div>
            <el-table
            :data="periods"
            fit
            v-loading="tableLoading"
            style="width: 100%">
                <el-table-column type="index"/>
                <el-table-column prop="name" align="center" label="时间段"/>
                <el-table-column prop="createTime" align="center" label="创建时间"/>
                <el-table-column fixed="right" align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showEditView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini">编辑</el-button>
                        <el-button @click="deletePeriod(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" type="danger" size="mini">删除</el-button>                    
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="40%">
            <el-form :model="period" ref="periodForm" :rules="rules" v-loading="formLoading">
                <el-form-item prop="name" label="时间段名称">
                    <!-- <el-input v-model="period.name" placeholder="请输入时间段名称" style="width: 80%"></el-input> -->
                    <el-input v-model="period.name" placeholder="请输入时间段名称，例如：14:30-16:30" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancelPeriod('periodForm')">取消</el-button>
                <el-button @click="addPeriod('periodForm')" type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "SysPeriod",
    data() {
        return {
            tableLoading: false,            
            total: 0,
            periods: [],
            dialogTitle: '',
            dialogVisible: false,
            period: {
                name: ''            
            },
            formLoading: false,
            rules: {
                name: [
                    { required: true, message: '必填：时间段名称！', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        loadDatas () {
            var _this = this
            this.tableLoading = true
            this.getRequest("/system/period")
            .then(resp => {
                _this.tableLoading = false
                if (resp && resp.status == 200) {
                    _this.periods = resp.data.obj
                    _this.total = this.periods.length
                }
            })
        },
        showAddView () {
            this.dialogVisible = true
            this.dialogTitle = '添加时间段'
        },
        cancelPeriod (formName) {
            this.dialogVisible = false
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].clearValidate()
            }
        },
        addPeriod (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var _this = this
                    this.formLoading = true
                    if(this.period.id) {
                        // 更新
                        this.putRequest("/system/period", this.period)
                        .then(resp => {
                            _this.handleResponse(_this, resp, formName)
                        })
                    } else {
                        // 插入
                        this.postRequest("/system/period", this.period)
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
                context.emptyPeriod()
            }
        },
        showEditView (period) {
            this.dialogVisible = true
            this.dialogTitle = '修改时间段'
            this.period = period
        },
        deletePeriod (period) {
            var _this = this
            this.$confirm('删除[' + period.name + ']时间段，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableLoading = true
                this.deleteRequest("/system/period/" + period.id)
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
        emptyPeriod() {
            this.period = {
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