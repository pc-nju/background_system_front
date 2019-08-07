<template>
    <div>
        <el-date-picker
            class="input-style"
            v-model="selectedYear"
            type="year"
            size="small"
            format="yyyy年"
            @change="handleTimeSelected"
            placeholder="选择年"></el-date-picker>
        <v-statistics :year="year" v-if="tableVisible"></v-statistics>
    </div>
</template>
<script>
import Statistics from "./Statistics"
export default {
    name: 'StatisticsYear',
    data() {
        return {
            year: '',
            selectedYear: '',
            tableVisible: false
        }
    },
    components: {
        "v-statistics": Statistics
    },
    methods: {
        handleTimeSelected () {
            this.year = this.selectedYear.getFullYear()
            this.tableVisible = true
        }
    },
}
</script>
<style lang="stylus" scoped>
    .input-style
        width 50%
</style>
