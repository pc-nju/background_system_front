<template>
    <div>
        <div class="form-container">
            <el-form :model="lesson">
                <el-form-item label="选择校区">
                    <el-select class="input-style" size="small" v-model="lesson.campusId" placeholder="请选择校区">
                        <el-option
                        v-for="item of campuses"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择周期">
                    <el-date-picker
                    ref="weekPicker"
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
            <el-table-column align="center" :label="times[0]" style="width: 14%">            
                <template slot-scope="scope">
                    <div v-html="scope.row.mon"></div>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="times[1]" style="width: 14%">   
                <template slot-scope="scope">
                    <div v-html="scope.row.tue"></div>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="times[2]" style="width: 14%">
                <template slot-scope="scope">
                    <div v-html="scope.row.wed"></div>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="times[3]" style="width: 14%">
                <template slot-scope="scope">
                    <div v-html="scope.row.thurs"></div>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="times[4]" style="width: 14%">
                <template slot-scope="scope">
                    <div v-html="scope.row.fri"></div>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="times[5]" style="width: 14%">
                <template slot-scope="scope">
                    <div v-html="scope.row.sat"></div>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="times[6]" style="width: 14%">
                <template slot-scope="scope">
                    <div v-html="scope.row.sun"></div>
                </template>
            </el-table-column>
        </el-table>
        <div class="dialog-container">
            <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close="handleDialogClose"
            width="40%">
                <el-form :model="lesson" v-loading="formLoading">
                    <el-form-item label="选择科目">
                        <el-select size="small" v-model="lesson.subjectId" placeholder="请选择科目" style="width:85%">
                            <el-option
                            v-for="item of subjects"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择老师">
                        <el-select size="small" v-model="lesson.userId" placeholder="请选择老师" style="width:85%">
                            <el-option
                            v-for="item of teachers"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择教室">
                        <el-select size="small" v-model="lesson.classroomId" placeholder="请选择教室" style="width:85%">
                            <el-option
                            v-for="item of classrooms"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>                    
                    <el-form-item label="开始时间">
                        <el-time-picker
                        v-model="lesson.startTime"
                        value-format="HH:mm"
                        :picker-options="{
                            selectableRange: selectableRange
                        }"
                        @change="handleStartTimeSelected"
                        size="small"
                        placeholder="请选择开始时间"></el-time-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-time-picker
                        v-model="lesson.endTime"
                        value-format="HH:mm"
                        :picker-options="{
                            selectableRange: selectableRange
                        }"
                        @change="handleEndTimeSelected"
                        size="small"
                        placeholder="请选择结束时间"></el-time-picker>
                    </el-form-item>
                    <el-form-item label="排课方式">
                        <el-radio-group 
                        v-model="arrangeLessonType"
                        @change="selectArrangeLessonType">
                            <el-radio :label="0">单次</el-radio>
                            <el-radio :label="1">每周循环</el-radio>
                        </el-radio-group>
                    </el-form-item>                  
                </el-form>
                <span slot="footer">
                    <el-button size="samll" @click="cancel">取消</el-button>
                    <el-button size="samll" type="primary" @click="addLesson">确定</el-button>
                </span>
            </el-dialog>            
        </div>
    </div>
</template>
<script>
import { stat } from 'fs';
export default {
    name: 'LessonBasic',
    data() {
        return {
            times: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
            campuses: [],
            subjects: [],
            periods: [],
            teachers: [],
            classrooms: [],
            lessonDtos: [],
            lesson: {
                subjectId: '',
                userId: '',
                classroomId: '',
                campusId: '',
                startTime: '',
                endTime: '',
                isWeekCycle: false
            },
            selectedDate: '',
            plans: [
                {period: '', mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''},
                {period: '', mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''},
                {period: '', mon: '', tue: '', wed: '', thurs: '', fri: '', sat: '', sun: ''}
            ],
            dialogTitle: '',
            dialogVisible: false,
            selectableRange: '',
            formLoading: false,
            arrangeDate: '',
            rowIndex: -1,
            colIndex: -1,
            selectedWeek: '',
            arrangeLessonType: 0
        }
    },
    methods: {
        loadDatas () {
            var _this = this
            this.getRequest('/lesson/basic/datas')
            .then(resp => {
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    var data = resp.data.obj
                    _this.campuses = data.campuses
                    _this.subjects = data.subjects
                    _this.periods = data.periods
                    _this.teachers = data.users
                    _this.classrooms = data.classrooms
                    _this.constructPlans()
                }
            })
        },
        loadLessons () {
            var _this = this
            this.getRequestWithParams('/lesson/basic', {
                startTime: this.selectedDate
            }).then(resp => {
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    var data = resp.data.obj

                    // 先记录原始数据，留修改使用
                    this.lessonDto = data

                    // 先置空
                    _this.plans = []
                    if (data instanceof Array && data.length > 0) {
                        _this.selectedWeek = data[0].week
                        var plans = data[0].plans
                        if (plans instanceof Array && plans.length > 0) {
                            plans.forEach(plan => {
                                var newPlan = {
                                    period: plan.period,
                                    mon: _this.showLesson(plan.mon), 
                                    tue: _this.showLesson(plan.tue),  
                                    wed: _this.showLesson(plan.wed),  
                                    thurs: _this.showLesson(plan.thurs),  
                                    fri: _this.showLesson(plan.fri),  
                                    sat: _this.showLesson(plan.sat),  
                                    sun: _this.showLesson(plan.sun)
                                }
                                // 重新构造
                                _this.plans.push(newPlan)
                            })
                        }
                    } else {
                        // 当该周暂无排课时，则使用初始化数据
                        _this.constructPlans()
                    }
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
            // 若当前方格无排课信息，则表明需要进行排课操作
            if (this.lesson.campusId && this.selectedDate) {
                var colIndex = ''
                if (this.times && this.times instanceof Array) {
                    for (let index = 0; index < this.times.length; index++) {
                        if(this.times[index] === column.label) {
                            colIndex = index + 1
                        }
                    }
                }
                var rowIndex = this.plans.indexOf(row)
                // 改变当前选中单元格背景色
                this.rowIndex = rowIndex
                this.colIndex = colIndex

                this.dialogVisible = true
                this.dialogTitle = '排课'

                var period = row.period
                var periodArr = period.split('-')
                var start = periodArr[0] + ':00'
                var end = periodArr[1] + ':00'

                this.selectableRange = start + ' - ' + end

                // 获取当前排课日期
                this.arrangeDate = column.label.slice(column.label.indexOf('【') + 1, column.label.indexOf('】'))
            } else {
                this.$message.error('请先选择校区和周期，再进行排课！')
            }
            

        },
        cellStyle ({row, column, rowIndex, columnIndex}) {
            if (rowIndex === this.rowIndex && columnIndex === this.colIndex) {
                return 'background:pink'
            } else {
                return ''
            } 
        },
        handleTimeSelected () {
            // 重置
            this.times = this.handleTime(new Date(this.selectedDate))
            //请求本周数据
            this.loadLessons()
        },
        handleStartTimeSelected () {
            this.lesson.startTime = this.arrangeDate + ' ' + this.lesson.startTime
        },
        handleEndTimeSelected () {
            this.lesson.endTime = this.arrangeDate + ' ' + this.lesson.endTime
        },
        selectArrangeLessonType () {
            // 排课每周循环
            if (this.arrangeLessonType == 1) {
                this.lesson.isWeekCycle = true
            }
        },
        cancel () {
            this.dialogVisible = false
            this.resetCellStyle()
        },
        handleDialogClose () {
            this.resetCellStyle()
        },
        resetCellStyle () {
            this.rowIndex = -1
            this.colIndex = -1
        },
        addLesson () {
            var _this = this
            this.formLoading = true
            this.postRequest('/lesson/basic', this.lesson)
            .then(resp => {
                _this.formLoading = false
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    _this.loadLessons()
                    _this.dialogVisible = false
                    _this.emptyParams()
                    _this.resetCellStyle()
                }
            })
        },
        emptyParams () {
            // 校区不能置空，必须保留
            var campusId = this.lesson.campusId
            this.lesson = {
                campusId: campusId,
                subjectId: '',
                userId: '',
                classroomId: '',
                startTime: '',
                endTime: '',
                isWeekCycle: false
            }
        }
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
