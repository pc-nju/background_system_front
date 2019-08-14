import Vue from 'vue'
Vue.filter("formatDate", formatDate)
Vue.prototype.formatDate = formatDate

function formatDate(value) {
    var result = ''
    if (value) {
        var date = new Date(value)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        if (month < 10) {
            month = "0" + month
        }
        if (day < 10) {
            day = "0" + day
        }
        result = year + "-" + month + "-" + day        
    }
    return result
}

Vue.filter("formatDateTime", function formatDateTime(value) {
    var date = new Date(value)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    if (month < 10) {
        month = "0" + month
    }
    if (day < 10) {
        day = "0" + day
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute    
})