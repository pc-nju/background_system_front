<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>校区数目（{{total}}条）</span>
                <el-button type="primary" size="mini" style="float: right">添加</el-button>                
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
            dialogVisible: false
        }
    },
    methods: {
        initDatas () {
            this.getRequest("/system/campus")
            .then(resp => {
                if (resp && resp.status == 200) {
                    this.campuses = resp.data.obj
                    this.total = this.campuses.length
                }
            })
        },
        showEditCampView (camp) {},
        deleteCamp (camp) {}
    },
    mounted() {
        this.initDatas()
    },
}
</script>
<style lang="stylus" scoped>
    .box-card
        width 100%
        text-align left
        margin-top 20px
</style>
