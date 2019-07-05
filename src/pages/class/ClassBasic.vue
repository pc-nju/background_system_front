<template>
    <div>
        <el-table
        class="class-container"
        :data="plans"
        stripe
        border 
        @cell-dblclick="handleDbClick"
        style="width: 100%">
            <el-table-column prop="period" align="center" label="时间段" style="width: 14%"></el-table-column>
            <el-table-column prop="mon" align="center" label="星期一" style="width: 14%"></el-table-column>
            <el-table-column prop="tue" align="center" label="星期二" style="width: 14%"></el-table-column>
            <el-table-column prop="wed" align="center" label="星期三" style="width: 14%"></el-table-column>
            <el-table-column prop="thurs" align="center" label="星期四" style="width: 14%"></el-table-column>
            <el-table-column prop="fri" align="center" label="星期五" style="width: 14%"></el-table-column>
            <el-table-column prop="sat" align="center" label="星期六" style="width: 14%"></el-table-column>
            <el-table-column prop="sun" align="center" label="星期日" style="width: 14%"></el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    name: 'ClassBasic',
    data() {
        return {
            plans: [
                {period: '14:30-16:00', mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''},
                {period: '16:00-17:30', mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''},
                {period: '19:30-21:00', mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''}
            ]
        }
    },
    methods: {
        handleDbClick (row, column, cell, event) {
            // 周几
            console.log(column.property)
            
            // label名
            console.log(column.label)
            
            // 时间段
            console.log(row.period)
        }
    },
}
</script>
<style lang="stylus" scoped>
    .class-container
        margin-top 20px
</style>
