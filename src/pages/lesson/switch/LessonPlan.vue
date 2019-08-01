<template>
    <div>
        <div class="searchContainer">
            <el-button size="mini" type="primary" @click="searchLessons">查询课表</el-button>
        </div>
        <el-table
        v-loading="tableLoading"
        v-if="tableVisible"
        class="table-container"
        :data="lessonDto.plans"
        stripe
        border 
        fit
        @cell-dblclick="handleDbClick"
        @cell-click="handleClick"
        :cell-style="cellStyle"
        :header-cell-style="headerCellStyle"
        style="width: 100%">
            <el-table-column :label="lessonDto.week + '排课计划'" align="center">
                <el-table-column prop="period" align="center" label="时间段" style="width: 14%"></el-table-column>
                <el-table-column align="center" :label="lessonDto.times[0]" style="width: 14%">            
                    <template slot-scope="scope">
                        <div v-html="scope.row.mon"></div>
                        <el-button v-if="scope.row.mon" type="text" icon="el-icon-delete" size="mini" @click="deleteLesson" />
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="lessonDto.times[1]" style="width: 14%">   
                    <template slot-scope="scope">
                        <div v-html="scope.row.tue"></div>
                        <el-button v-if="scope.row.tue" type="text" icon="el-icon-delete" size="mini" @click="deleteLesson" />
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="lessonDto.times[2]" style="width: 14%">
                    <template slot-scope="scope">
                        <div v-html="scope.row.wed"></div>
                        <el-button v-if="scope.row.wed" type="text" icon="el-icon-delete" size="mini" @click="deleteLesson" />
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="lessonDto.times[3]" style="width: 14%">
                    <template slot-scope="scope">
                        <div v-html="scope.row.thurs"></div>
                        <el-button v-if="scope.row.thurs" type="text" icon="el-icon-delete" size="mini" @click="deleteLesson" />
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="lessonDto.times[4]" style="width: 14%">
                    <template slot-scope="scope">
                        <div v-html="scope.row.fri"></div>
                        <el-button v-if="scope.row.fri" type="text" icon="el-icon-delete" size="mini" @click="deleteLesson" />
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="lessonDto.times[5]" style="width: 14%">
                    <template slot-scope="scope">
                        <div v-html="scope.row.sat"></div>
                        <el-button v-if="scope.row.sat" type="text" icon="el-icon-delete" size="mini" @click="deleteLesson" />
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="lessonDto.times[6]" style="width: 14%">
                    <template slot-scope="scope">
                        <div v-html="scope.row.sun"></div>
                        <el-button v-if="scope.row.sun" type="text" icon="el-icon-delete" size="mini" @click="deleteLesson" />
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <div class="dialog-container">
            <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close="handleDialogClose"
            width="40%"
            v-loading="dialogLoading">
                <el-form :model="lesson">
                    <el-form-item label="选择科目" v-if="subjectVisible">
                        <el-select size="small" v-model="lesson.subjectId" placeholder="请选择科目" style="width:85%">
                            <el-option
                            v-for="item of subjects"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择老师" v-if="teacherVisible">
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
                        <el-select size="small" v-model="lesson.classroomId" placeholder="请选择老师" style="width:85%">
                            <el-option
                            v-for="item of classrooms"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>                    
                    <el-form-item label="上课日期">
                        <el-date-picker
                        v-model="lesson.startDate"
                        value-format="yyy-MM-dd"
                        type="date"
                        size="small"
                        placeholder="请选择上课日期"/>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-time-picker
                        v-model="lesson.startTime"
                        value-format="HH:mm"
                        size="small"
                        placeholder="请选择开始时间"></el-time-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-time-picker
                        v-model="lesson.endTime"
                        value-format="HH:mm"
                        size="small"
                        placeholder="请选择结束时间"></el-time-picker>
                    </el-form-item>                  
                </el-form>
                <span slot="footer">
                    <el-button size="samll" @click="cancel">取消</el-button>
                    <el-button size="samll" type="primary" @click="arrangeLesson">确定</el-button>
                </span>
            </el-dialog>            
        </div>        
    </div>
</template>
<script>
export default {
    name: 'LessonPlan',
    data() {
        return {
            lessonDto: {},
            lessons: [],
            tableLoading: false,
            tableVisible: false,
            startDate: '',
            dialogTitle: '',
            dialogVisible: false,
            dialogLoading: false,
            subjectVisible: false,
            teacherVisible: true,
            rowIndex: -1,
            colIndex: -1,
            lesson: {
                id: '',
                campusId: '',
                subjectId: '',
                userId: '',
                classroomId: '',
                startDate: '',
                startTime: '',
                endTime: ''
            },
            selectableRange: '',
            deleteLessonTag: false
        }
    },
    methods: {
        searchLessons () {
            this.tableLoading = true
            this.getRequestWithParams('/lesson/basic', {
                startTime: this.selectedDate,
                userId: this.userId,
                subjectId: this.subjectId,
                campusId: this.campusId
            }).then(resp => {
                this.tableLoading = false
                // 置空
                this.lessonDto = {}
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    var lessons = resp.data.obj
                    if (lessons instanceof Array && lessons.length > 0) {
                        var lesson = lessons[0]
                        this.lessons = lesson.plans
                        var plans = lesson.plans
                        var newPlans = []
                        if (plans instanceof Array && plans.length > 0) {
                            plans.forEach(plan => {
                                var newPlan = {
                                    period: plan.period,
                                    mon: this.showLesson(plan.mon), 
                                    tue: this.showLesson(plan.tue),  
                                    wed: this.showLesson(plan.wed),  
                                    thurs: this.showLesson(plan.thurs),  
                                    fri: this.showLesson(plan.fri),  
                                    sat: this.showLesson(plan.sat),  
                                    sun: this.showLesson(plan.sun)                                        
                                }
                                newPlans.push(newPlan)
                            })
                        }
                        this.lessonDto = {
                            week: lesson.week,
                            plans: newPlans,
                            times: this.handleTime(new Date(lesson.monday))
                        }
                        this.tableVisible = true
                    } else {
                        this.tableVisible = false
                        this.$message('暂无排课计划！')
                    }                    
                }
            })
        },
        getColumnIndex (column) {
            var colIndex = ''
            var times = this.lessonDto.times
            if (times && times instanceof Array) {
                for (let index = 0; index < times.length; index++) {
                    if(times[index] === column.label) {
                        colIndex = index + 1
                    }
                }
            }
            return colIndex            
        },
        handleDbClick (row, column, cell, event) {
            var colIndex = this.getColumnIndex(column)

            var rowIndex = this.lessonDto.plans.indexOf(row)
            // 改变当前选中单元格背景色
            this.rowIndex = rowIndex
            this.colIndex = colIndex

            this.dialogVisible = true

            var period = row.period
            var periodArr = period.split('-')
            var start = periodArr[0] + ':00'
            var end = periodArr[1] + ':00'

            this.selectableRange = start + ' - ' + end
            var lessons = this.getLessons(rowIndex, colIndex)
            // 置空对象，防止被复用
            this.emptyLesson()
            if (lessons && lessons instanceof Array && lessons.length > 0) {
                // 若当前方格有排课信息，则是修改排课信息
                this.lesson = {
                    id: lessons[0].id,
                    campusId: lessons[0].campusId,
                    subjectId: lessons[0].subjectId,
                    userId: lessons[0].userId,
                    classroomId: lessons[0].classroomId,
                    startDate: lessons[0].startTime[0] + '-' + lessons[0].startTime[1] + '-' + lessons[0].startTime[2],
                    startTime: this.translateTime2Str(lessons[0].startTime),
                    endTime: this.translateTime2Str(lessons[0].endTime)
                }
                this.dialogTitle = '调课'
            } else {
                this.dialogTitle = '排课'
            }
        },
        handleClick (row, column, cell, event) {
            if (this.deleteLessonTag) {
                var colIndex = this.getColumnIndex(column)
                var rowIndex = this.lessonDto.plans.indexOf(row) 
                var lessons = this.getLessons(rowIndex, colIndex)
                if (lessons && lessons instanceof Array && lessons.length > 0) {
                    this.$confirm('删除该[' + row.period + ']时段排课计划，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        var ids = ''
                        lessons.forEach(lesson => {
                            ids += lesson.id + ','
                        })
                        ids = ids.slice(0, ids.length-1)
                        this.deleteRequest('/lesson/basic/' + ids)
                        .then(resp => {
                            if (resp && resp.status == 200 && resp.data.status == 200) {
                                this.searchLessons()
                                // 重置
                                this.deleteRequest = false
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                        // 重置，否则在先单击删除，取消之后，再双击修改时，仍会触发删除
                        this.deleteLessonTag = false
                    })                    
                }              
            }
        },
        getLessons (rowIndex, columnIndex) {
            var tempLessons
            if (this.lessons && this.lessons instanceof Array && this.lessons.length > 0) {
                switch (columnIndex) {
                    case 1:
                        tempLessons = this.lessons[rowIndex].mon
                        break
                    case 2:
                        tempLessons = this.lessons[rowIndex].tue
                        break
                    case 3:
                        tempLessons = this.lessons[rowIndex].wed
                        break
                    case 4:
                        tempLessons = this.lessons[rowIndex].thurs
                        break
                    case 5:
                        tempLessons = this.lessons[rowIndex].fri
                        break
                    case 6:
                        tempLessons = this.lessons[rowIndex].sat
                        break
                    case 7:
                        tempLessons = this.lessons[rowIndex].sun
                        break
                    default:
                        tempLessons = null
                        break
                }
            }                
            return tempLessons
        },
        emptyLesson () {
            this.lesson = {
                id: '',
                campusId: '',
                subjectId: '',
                userId: '',
                classroomId: '',
                startDate: '',
                startTime: '',
                endTime: ''                
            }            
        },
        cellStyle ({row, column, rowIndex, columnIndex}) {
            if (rowIndex === this.rowIndex && columnIndex === this.colIndex) {
                return 'background:pink'
            } else {
                return ''
            } 
        },
        headerCellStyle ({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0 && columnIndex === 0) {
                // 设置标题栏样式
                return {background: '#fff', color: '#000', 'font-size': '20px', 'font-weight': 'bold'}
            } else {
                // 普通表头样式
                return {background: '#409EFF', color: '#fff'}
            }
        },
        handleDialogClose () {
            this.resetCellStyle()
        },
        cancel () {
            this.dialogVisible = false
            this.emptyLesson()
            this.resetCellStyle()
        },
        resetCellStyle () {
            this.rowIndex = -1
            this.colIndex = -1
        },
        arrangeLesson () {
            this.dialogLoading = true
            var newLesson = {
                id: this.lesson.id,
                campusId: this.lesson.campusId,
                subjectId: this.lesson.subjectId,
                userId: this.lesson.userId,
                classroomId: this.lesson.classroomId,
                startDate: this.lesson.startDate,
                startTime: this.selectedDate + ' ' + this.lesson.startTime,
                endTime: this.selectedDate + ' ' + this.lesson.endTime
            }
            if (newLesson.id) {
                // 修改课程信息
                this.putRequest('/lesson/basic', newLesson)
                .then(resp => {
                    this.handleResp(this, resp)
                })
            } else {
                // 新增课程
                this.postRequest('/lesson/basic', newLesson)
                .then(resp => {
                    this.handleResp(this, resp)
                })
            }
        },
        handleResp (context, resp) {
            context.dialogLoading = false
            if (resp && resp.status == 200 && resp.data.status == 200) {
                context.dialogVisible = false
                context.searchLessons()
                context.emptyLesson()
                context.resetCellStyle()
            }
        },
        deleteLesson () {
            this.deleteLessonTag = true
        }
    },
    props: {
        subjects: Array,
        teachers: Array,
        classrooms: Array,
        selectedDate: String,
        campusId: String,
        subjectId: String,
        userId: String,
        classroomId: String
    }
}
</script>
<style lang="stylus" scoped>
    .searchContainer
        width 100%
        display flex
        justify-content center
    .table-container
        margin-top 20px
    .dialog-container
        text-align left
</style>
