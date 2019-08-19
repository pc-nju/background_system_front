<template>
    <div>
        <div class="searchContainer">
            <el-button size="mini" type="primary" @click="searchLessons">查询课表</el-button>
            <el-button size="mini" type="danger" @click="download" v-if="tableVisible">下载课表</el-button>
        </div>
        <div ref="lessonTableImg" class="table-container">
            <el-table
            v-loading="tableLoading"
            v-if="tableVisible"
            :data="lessonDto.plans"
            stripe
            border 
            fit
            :header-cell-style="headerCellStyle"
            style="width: 100%">
                <el-table-column :label="lessonDto.week + '排课计划'" align="center">
                    <el-table-column prop="period" align="center" label="时间段" style="width: 14%"></el-table-column>
                    <el-table-column align="center" :label="lessonDto.times[0]" style="width: 14%">            
                        <template slot-scope="scope">
                            <div v-html="scope.row.mon"></div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="lessonDto.times[1]" style="width: 14%">   
                        <template slot-scope="scope">
                            <div v-html="scope.row.tue"></div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="lessonDto.times[2]" style="width: 14%">
                        <template slot-scope="scope">
                            <div v-html="scope.row.wed"></div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="lessonDto.times[3]" style="width: 14%">
                        <template slot-scope="scope">
                            <div v-html="scope.row.thurs"></div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="lessonDto.times[4]" style="width: 14%">
                        <template slot-scope="scope">
                            <div v-html="scope.row.fri"></div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="lessonDto.times[5]" style="width: 14%">
                        <template slot-scope="scope">
                            <div v-html="scope.row.sat"></div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="lessonDto.times[6]" style="width: 14%">
                        <template slot-scope="scope">
                            <div v-html="scope.row.sun"></div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import html2canvas from "html2canvas"
import Canvas2Image from '../../../utils/canvas2image'

export default {
    name: 'PlanShow',
    data() {
        return {
            lessonDto: {},
            lessons: [],
            tableLoading: false,
            tableVisible: false,
            subjectVisible: false,
            teacherVisible: true
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
        headerCellStyle ({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0 && columnIndex === 0) {
                // 设置标题栏样式
                return {background: '#fff', color: '#000', 'font-size': '20px', 'font-weight': 'bold'}
            } else {
                // 普通表头样式
                return {background: '#409EFF', color: '#fff'}
            }
        },
        download () {
            var downloadContent = this.$refs.lessonTableImg
            var width  = downloadContent.offsetWidth
            var height  = downloadContent.offsetHeight
            var canvas = document.createElement('canvas')
            var scale = 2
            canvas.width = width * 2
            canvas.height = height * scale
            canvas.getContext('2d').scale(scale, scale)
            var opts = {
                scale: scale,
                canvas: canvas,
                // 日志开关，便于查看html2canvas的内部执行流程
                // logging: true,
                width: width,
                height: height,
                // 避免下载不全
                backgroundColor: null,
                // 【重要】开启跨域配置
                useCORS: true
            }

            html2canvas(downloadContent, opts).then((canvas) => {
                var context = canvas.getContext('2d')
                // 【重要】关闭抗锯齿
                context.mozImageSmoothingEnabled = false
                context.webkitImageSmoothingEnabled = false
                context.msImageSmoothingEnabled = false
                context.imageSmoothingEnabled = false

                var img = Canvas2Image.convertToJPEG(canvas, canvas.width/2, canvas.height/2)
                
                let dataURL = img.getAttribute('src')

                // 下载图片
                let a = document.createElement('a')
                document.body.appendChild(a)
                a.href = img.src
                // 设置下载标题
                a.download = this.lessonDto.week + "排课计划"
                a.click()

            })
        }
    },
    props: {
        subjects: Array,
        teachers: Array,
        selectedDate: String,
        campusId: String,
        subjectId: String,
        userId: String
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
</style>
