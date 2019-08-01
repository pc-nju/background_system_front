<template>
    <div class="switch-container">
        <el-tabs v-model="defaultTab" type="card" v-loading="fullLoading">
            <el-tab-pane label="按老师调课" name="teacherSwitch">
                <teacher-switch :campuses="campuses" :teachers="teachers" :classrooms="classrooms"></teacher-switch>
            </el-tab-pane>
            <el-tab-pane label="按课程调课" name="subjectSwitch">
                <subject-switch :campuses="campuses" :subjects="subjects" :classrooms="classrooms"></subject-switch>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import TeacherSwitch from "./switch/TeacherSwitch"
import SubjectSwitch from "./switch/SubjectSwitch"

export default {
    name: 'LessonSwitch',
    data() {
        return {
            defaultTab: 'teacherSwitch',
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
                    this.classrooms = data.classrooms
                }
            })
        }
    },
    components: {
        TeacherSwitch,
        SubjectSwitch
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
