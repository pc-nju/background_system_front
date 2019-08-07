<template>
    <div>
        <el-table
        class="statistics-container"
        :data="statistics"
        stripe 
        border
        show-summary
        style="width: 100%">
            <el-table-column type="index" width="80" align="center"/>
            <el-table-column label="姓名" width="150" prop="username" align="center"/>
            <el-table-column label="合计" prop="total" align="center"/>
            <el-table-column
            v-for="(item, index) of subjects"
            :key="index"
            :label="item.name"
            :prop="item.name"
            align="center"
            sortable
            width="150"
            ></el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    name: 'Statistics',
    data() {
        return {
            fullLoading: false,
            subjects: [],
            statistics: []
        }
    },
    methods: {
        loadDatas () {
            this.fullLoading = true
            // 置空，防止前一次请求的数据出现在本次显示中
            this.statistics = []            
            this.getRequestWithParams("/statistics/lessons", {
                year: this.year,
                month: this.month
            }).then(resp => {
                this.fullLoading = false
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    var users = resp.data.obj.users
                    this.subjects = resp.data.obj.subjects
                    var lessonStatistics = resp.data.obj.statistics
                    for (var userId in lessonStatistics) {
                        var obj = {}
                        var username = users[userId]
                        obj['username'] = username
                        var value = lessonStatistics[userId]
                        var sum = 0
                        for (var subjectName in value) {
                            obj[subjectName] = value[subjectName]
                            sum += value[subjectName]
                        }
                        obj['total'] = sum
                        this.statistics.push(obj)
                    }
                }
            })
        }
    },
    props: {
        year: Number,
        month: Number
    },
    mounted() {
        this.loadDatas()
    },
    watch: {
        year () {
            if(this.year) {
                this.loadDatas()
            }
        },
        month () {
            if(this.month) {
                this.loadDatas()
            }
        }
    },
}
</script>
<style lang="stylus">
.statistics-container
    margin-top 20px
.el-table
    overflow auto 
.el-table--scrollable-x .el-table__body-wrapper
    overflow-x visible
.el-table__body-wrapper
    overflow visible
.el-table__header-wrapper
    overflow visible
.el-table__footer-wrapper
    overflow visible
.el-table::after
    position relative !important    
</style>