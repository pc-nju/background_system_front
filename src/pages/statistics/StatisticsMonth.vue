<template>
    <div>
        <el-date-picker
            class="input-style"
            v-model="selectedMonth"
            type="month"
            size="small"
            format="yyyy年M月"
            @change="handleTimeSelected"
            placeholder="选择月"></el-date-picker>
        <v-statistics :year="year" :month="month" v-if="tableVisible"></v-statistics>
    </div>
</template>
<script>
import Statistics from "./Statistics"
export default {
    name: 'StatisticsMonth',
    data() {
        return {
            year: '',
            month: '',
            selectedMonth: '',
            tableVisible: false
        }
    },
    components: {
        "v-statistics": Statistics
    },
    methods: {
        handleTimeSelected () {
            this.year = this.selectedMonth.getFullYear()
            this.month = this.selectedMonth.getMonth() + 1
            this.tableVisible = true
        }
    },
}
</script>
<style lang="stylus" scoped>
    .input-style
        width 50%
</style>
