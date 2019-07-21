<template>
    <div class="lesson-container">
        <el-collapse 
        class="collapse-container" 
        v-model="activeColItem" 
        accordion 
        @change="collapseChange(activeColItem)"
        v-loading="fullLoading">
            <el-collapse-item
            v-for="item in campuses"
            :key="item.id"
            :title="item.name"
            :name="item.id">
                <el-card class="box-card">
                    <div slot="header">
                        <span>课程表</span>
                    </div>
                    <div>
                        <el-table
                        v-for="lesson in lessons"
                        :key="lesson.id"
                        :data="lesson.plans"
                        stripe
                        border 
                        fit
                        :header-cell-style="headerCellStyle"
                        style="width: 100%">
                            <el-table-column :label="lesson.week + '排课计划'" align="center">
                                <el-table-column prop="period" align="center" label="时间段" style="width: 14%"></el-table-column>
                                <el-table-column align="center" :label="lesson.times[0]" style="width: 14%">            
                                    <template slot-scope="scope">
                                        <div v-html="scope.row.mon"></div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" :label="lesson.times[1]" style="width: 14%">   
                                    <template slot-scope="scope">
                                        <div v-html="scope.row.tue"></div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" :label="lesson.times[2]" style="width: 14%">
                                    <template slot-scope="scope">
                                        <div v-html="scope.row.wed"></div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" :label="lesson.times[3]" style="width: 14%">
                                    <template slot-scope="scope">
                                        <div v-html="scope.row.thurs"></div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" :label="lesson.times[4]" style="width: 14%">
                                    <template slot-scope="scope">
                                        <div v-html="scope.row.fri"></div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" :label="lesson.times[5]" style="width: 14%">
                                    <template slot-scope="scope">
                                        <div v-html="scope.row.sat"></div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" :label="lesson.times[6]" style="width: 14%">
                                    <template slot-scope="scope">
                                        <div v-html="scope.row.sun"></div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </el-table>                        
                    </div>
                </el-card>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
export default {
    name: 'LessonCampus',
    data() {
        return {
            fullLoading: false,
            activeColItem: '',
            campuses: [],
            lessons: [],
            times: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        }
    },
    methods: {
        loadDatas () {
            this.fullLoading = true
            this.getRequest('/lesson/basic/campuses')
            .then(resp => {
                this.fullLoading = false
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    this.campuses = resp.data.obj
                }
            })
        },
        collapseChange (activeColItem) {
            if (activeColItem) {
                this.fullLoading = true
                this.getRequestWithParams('/lesson/basic', {
                    campusId: activeColItem
                }).then(resp => {
                    this.fullLoading = false
                    if (resp && resp.status == 200 && resp.data.status == 200) {
                        // 要先置空，防止当查询无数据时，复用上一次查询到得数据
                        this.lessons = []

                        var lessons = this.sortLessonsByWeek(resp.data.obj)
                        if (lessons instanceof Array && lessons.length > 0) {
                            lessons.forEach(lesson => {
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
                                var newLesson = {
                                    week: lesson.week,
                                    plans: newPlans,
                                    times: this.handleTime(new Date(lesson.monday))
                                }
                                this.lessons.push(newLesson)
                            })
                        }
                    }
                })                
            }
        },
        /**
         * 按周进行排序
         */
        sortLessonsByWeek (lessons) {
            if (lessons && lessons instanceof Array && lessons.length > 0) {
                lessons.sort((a, b) => {
                    return a.week > b.week
                })
                return lessons                
            }
            return null
        },
        headerCellStyle ({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0 && columnIndex === 0) {
                // 设置标题栏样式
                return {background: '#fff', color: '#000', 'font-size': '20px', 'font-weight': 'bold'}
            } else {
                // 普通表头样式
                return {background: '#409EFF', color: '#fff'}
            }
        }
    },
    mounted() {
        this.loadDatas()
    },
}
</script>
<style lang="stylus" scoped>
    .lesson-container
        margin-top 20px
        text-align left 
        .collapse-container
            width 85%
</style>
