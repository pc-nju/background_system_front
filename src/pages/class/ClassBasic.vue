<template>
    <div>
        <div class="week-container">
            <span style="margin-right: 20px">选择周期</span>
            <el-date-picker
            v-model="value"
            type="week"
            format="yyyy 第 WW 周"
            size="small"
            style="width: 50%"
            @change="handleTimeSelected"
            placeholder="选择周"></el-date-picker>
        </div>
        <el-table
        class="class-container"
        :data="plans"
        stripe
        border 
        fit
        @cell-dblclick="handleDbClick"
        :cell-style="cellStyle"
        :header-cell-style="{background: '#409EFF', color: '#fff'}"
        style="width: 100%">
            <el-table-column prop="period" align="center" label="时间段" style="width: 14%"></el-table-column>
            <el-table-column prop="mon" align="center" :label="times[0]" style="width: 14%"></el-table-column>
            <el-table-column prop="tue" align="center" :label="times[1]" style="width: 14%"></el-table-column>
            <el-table-column prop="wed" align="center" :label="times[2]" style="width: 14%"></el-table-column>
            <el-table-column prop="thurs" align="center" :label="times[3]" style="width: 14%"></el-table-column>
            <el-table-column prop="fri" align="center" :label="times[4]" style="width: 14%"></el-table-column>
            <el-table-column prop="sat" align="center" :label="times[5]" style="width: 14%"></el-table-column>
            <el-table-column prop="sun" align="center" :label="times[6]" style="width: 14%"></el-table-column>
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
            ],
            cells: [],
            value: '',
            times: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
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
            
            console.log('------------------')
            console.log('行号：' + (this.plans.indexOf(row) + 1))
            // 列
            console.log('列号：' + event.srcElement.cellIndex)
            var newCell = {
                rowIndex: this.plans.indexOf(row),
                columnIndex: event.srcElement.cellIndex
            }            
            this.cells.push(newCell)
        },
        cellStyle ({row, column, rowIndex, columnIndex}) {
            for (let i = 0; i < this.cells.length; i++) {
                const element = this.cells[i]
                if (rowIndex === element.rowIndex && columnIndex === element.columnIndex) {
                    return 'background:pink'
                }                  
            }
            return ''
        },
        handleTimeSelected () {
            // 重置
            this.times = []
            var date = new Date(this.value)
            this.times.push("星期一【" + this.formatTime(date) + "】")
            var temp
            for (var i=0; i<6; i++) {
                // 加 i 天
                date.setDate(date.getDate() + 1)
                switch (i) {
                    case 0:
                        temp = "星期二【" + this.formatTime(date) + "】"
                        break
                    case 1:
                        temp = "星期三【" + this.formatTime(date) + "】"
                        break
                    case 2:
                        temp = "星期四【" + this.formatTime(date) + "】"
                        break
                    case 3:
                        temp = "星期五【" + this.formatTime(date) + "】"
                        break
                    case 4:
                        temp = "星期六【" + this.formatTime(date) + "】"
                        break
                    default:
                        temp = "星期日【" + this.formatTime(date) + "】"
                        break
                }
                this.times.push(temp)
            }
        }
    },
}
</script>
<style lang="stylus" scoped>
    .week-container
        margin-top 20px
        text-align left
    .class-container
        margin-top 20px
</style>
