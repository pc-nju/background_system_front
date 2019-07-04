<template>
    <div>
        <el-table :data="plans" style="width: 100%">
            <el-table-column prop="period" label="时间段" width="180"></el-table-column>
            <el-table-column prop="mon" label="星期一" width="180"></el-table-column>
            <el-table-column prop="tue" label="星期二" width="180"></el-table-column>
            <el-table-column prop="wed" label="星期三" width="180"></el-table-column>
            <el-table-column prop="thurs" label="星期四" width="180"></el-table-column>
            <el-table-column prop="fri" label="星期五" width="180"></el-table-column>
            <el-table-column prop="sat" label="星期六" width="180"></el-table-column>
            <el-table-column prop="sun" label="星期七" width="180"></el-table-column>
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
}
</script>
<style lang="stylus" scoped>

</style>
