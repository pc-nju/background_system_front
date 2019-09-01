<template>
    <div class="switch-container">
        <el-tabs v-model="defaultTab" type="card" v-loading="fullLoading">
            <el-tab-pane label="按周下载" name="WeekDownload">
                <week-download :campuses="campuses"></week-download>
            </el-tab-pane>  
            <el-tab-pane label="按课程下载" name="SubjectDownload">
                <subject-download :campuses="campuses" :subjects="subjects"></subject-download>
            </el-tab-pane>            
            <el-tab-pane label="按老师下载" name="TeacherDownload">
                <teacher-download :campuses="campuses" :teachers="teachers"></teacher-download>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import WeekDownload from "./download/WeekDownload"
import SubjectDownload from "./download/SubjectDownload"
import TeacherDownload from "./download/TeacherDownload"

export default {
    name: 'LessonPlanDownload',
    data() {
        return {
            defaultTab: 'WeekDownload',
            fullLoading: false,
            campuses: [],
            subjects: [],
            teachers: [],
            classrooms: []
        }
    },
    methods: {
        loadDatas () {
            this.fullLoading = true
            this.getRequest('/lesson/basic/datas')
            .then(resp => {
                this.fullLoading = false
                if (resp && resp.status == 200 && resp.data.status == 200) {
                    var data = resp.data.obj
                    this.campuses = data.campuses
                    this.subjects = data.subjects
                    this.teachers = data.users
                }
            })
        }
    },
    components: {
        WeekDownload,
        SubjectDownload,
        TeacherDownload
    },
    mounted() {
        this.loadDatas()
    },
}
</script>
<style lang="stylus" scoped>
    .switch-container
        margin-top 10px
</style>
