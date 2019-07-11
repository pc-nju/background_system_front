<template>
    <div>
        <div class="form-container">
            <el-form :rules="rules">
                <el-form-item prop="campus" label="选择校区">
                    <el-select class="input-style" size="small" v-model="campus" placeholder="请选择校区">
                        <el-option
                        v-for="item of campuses"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="week" label="选择周期">
                    <el-date-picker
                    class="input-style"
                    v-model="selectedDate"
                    type="week"
                    format="yyyy 第 WW 周"
                    size="small"
                    @change="handleTimeSelected"
                    placeholder="选择周"></el-date-picker>
                </el-form-item>
            </el-form>
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
        <div class="dialog-container">
            <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="40%">
                <el-form ref="classForm" :rules="classRules">
                    <el-form-item prop="subject" label="选择科目">
                        <el-select size="small" v-model="subject" placeholder="请选择科目" style="width:85%">
                            <el-option
                            v-for="item of subjects"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="teacher" label="选择老师">
                        <el-select size="small" v-model="teacher" placeholder="请选择老师" style="width:85%">
                            <el-option
                            v-for="item of teachers"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="startTime" label="开始时间">
                        <el-time-picker
                        v-model="startTime"
                        :picker-options="{
                            selectableRange: selectableRange
                        }"
                        size="small"
                        placeholder="请选择开始时间"></el-time-picker>
                    </el-form-item>
                    <el-form-item prop="endTime" label="结束时间">
                        <el-time-picker
                        v-model="endTime"
                        :picker-options="{
                            selectableRange: selectableRange
                        }"
                        size="small"
                        placeholder="请选择结束时间"></el-time-picker>
                    </el-form-item>                  
                </el-form>
                <span slot="footer">
                    <el-button size="samll" @click="cancel('classForm')">取消</el-button>
                    <el-button size="samll" type="primary" @click="addClass('classForm')">确定</el-button>
                </span>
            </el-dialog>            
        </div>
    </div>
</template>
<script>
import { stat } from 'fs';
export default {
    name: 'ClassBasic',
    data() {
        return {
            campuses: [],
            subjects: [],
            periods: [],
            teachers: [],
            campus: '',
            subject: '',
            teacher: '',
            selectedDate: '',
            rules: {
                campus: [
                    { required: true, message: '必选：校区！', trigger: 'blur' }
                ],
                week: [
                    { required: true, message: '必选：周！', trigger: 'blur' }
                ]
            },
            plans: [
                {period: '14:30-16:00', mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''},
                {period: '16:00-17:30', mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''},
                {period: '19:30-21:00', mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''}
            ],
            dialogTitle: '',
            dialogVisible: false,
            classRules: {
                subject: [
                    { required: true, message: '必选：校区！', trigger: 'blur' }
                ],
                teacher: [
                    { required: true, message: '必选：老师！', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '必选：开始时间！', trigger: 'blur' }
                ],
                endTime: [
                    { required: true, message: '必选：结束时间！', trigger: 'blur' }
                ],
            },
            selectableRange: '',
            startTime: '',
            endTime: '',
            cells: [],
            times: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        }
    },
    methods: {
        loadDatas () {
            var _this = this
            this.getRequest('/class/basic/datas')
            .then(resp => {
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    var data = resp.data.obj
                    _this.campuses = data.campuses
                    _this.subjects = data.subjects
                    _this.periods = data.periods
                    _this.teachers = data.users
                    _this.constructPlans()
                }
            })
        },
        constructPlans () {
            this.plans = []
            for (let i = 0; i < this.periods.length; i++) {
                this.plans.push(this.initPlan(this.periods[i]))
            }
        },
        initPlan (period) {
            return {
                period: period.name,
                mon: '', 
                tue: '', 
                wed: '', 
                thurs: '', 
                fri: '', 
                sat: '', 
                sun: ''
            }
        },
        handleDbClick (row, column, cell, event) {
            this.dialogVisible = true
            this.dialogTitle = '排课'

            var period = row.period
            var periodArr = period.split('-')
            var start = periodArr[0] + ':00'
            var end = periodArr[1] + ':00'

            this.selectableRange = start + ' - ' + end



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
            var date = new Date(this.selectedDate)
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
        },
        cancel (formName) {
            this.dialogVisible = false
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].clearValidate()
            }
        },
        addClass (formName) {}
    },
    mounted() {
        this.loadDatas()
    },
}
</script>
<style lang="stylus" scoped>
    .form-container
        margin-top 20px
        text-align left
        .input-style
            width 50%
    .class-container
        margin-top 20px
    .dialog-container
        text-align left
</style>
