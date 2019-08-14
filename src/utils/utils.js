import { getRequest } from "./api"
import { Message } from "element-ui"
/**
 * 业务逻辑：
 *     在初始化菜单中，首先判断store中的数据是否存在，如果存在，说明这次跳转是正常的跳转，
 * 而不是用户按F5或者直接在地址栏输入某个地址进入的。否则就去加载菜单。
 *     拿到菜单之后，首先通过formatRoutes方法将服务器返回的json转为router需要的格式，
 * 这里主要是转component，因为服务端返回的component是一个字符串，而router中需要的却是
 * 一个组件，因此我们在formatRoutes方法中动态的加载需要的组件即可。数据格式准备成功之后，
 * 一方面将数据存到store中，另一方面利用路由中的addRoutes方法将之动态添加到路由中。
 */
export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return
    }
    getRequest("/menus/system").then(resp => {
        if (resp && resp.data &&resp.data.status == 200) {
            var fmtRoutes = formatRoutes(resp.data.obj)
            router.addRoutes(fmtRoutes)
            store.commit('initMenu', fmtRoutes)
            // 聊天的处理逻辑，后续添加
            // store.dispatch('connect')
        }
    })
}
export const formatRoutes = routes => {
    let fmtRoutes = []
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router
        if (children && children instanceof Array) {
            children = formatRoutes(children)
        }
        let fmtRouter = {
            path: path,
            component (resolve) {
                if (component.startsWith("Home")) {
                    require(['../pages/home/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sys")) {
                    require(['../pages/system/' + component + '.vue'], resolve)
                } else if (component.startsWith("Lesson")) {
                    require(['../pages/lesson/' + component + '.vue'], resolve)
                } else if (component.startsWith("Statistics")) {
                    require(['../pages/statistics/' + component + '.vue'], resolve)
                } else if (component.startsWith("Student")) {
                    require(['../pages/student/' + component + '.vue'], resolve)
                }
            },
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children
        }
        fmtRoutes.push(fmtRouter)
    })
    return fmtRoutes
}

export const UN_LOGIN = "尚未登录，请登录！"

export const isNotNullOrBlank = (...args) => {
    args.forEach(arg => {
        if(arg == null || arg == '' || arg == undefined) {
            Message.warning({message: '数据不能为空！'})
            return false
        }
    })
    return true
}

export const formatTime = date => {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month < 10 ? ('0' + month) : month
    var day = date.getDate()
    day = day < 10 ? ('0' + day) : day  
    return year + '-' + month + '-' + day  
}
export const showLesson = lessons => {
    var result = ''
    if (lessons instanceof Array && lessons.length > 0) {
        lessons.forEach(lesson => {
            var subjectName = lesson.subject.name
            var teacherName = lesson.user.name 
            var classroomName = lesson.classroom.name
            var startTime = lesson.startTime
            var endTime = lesson.endTime
            var timeRange = translateTime2Str(startTime) + '-' + translateTime2Str(endTime)
            result += subjectName + '<br/>' + teacherName + '<br/>' + classroomName + '<br/>' + timeRange + '<br/>'
        })
    }
    return result
}
export const translateTime2Str = time => {
    var hour = time[3]
    if (hour < 10) {
        hour = '0' + hour
    }
    var minute = time[4]
    if (minute < 10) {
        minute = '0' + minute
    }
    return hour + ':' + minute
}
export const handleTime = (date) => {
    // 重置
    var times = []
    times.push("星期一【" + formatTime(date) + "】")
    var temp
    for (var i=0; i<6; i++) {
        // 加 i 天
        date.setDate(date.getDate() + 1)
        switch (i) {
            case 0:
                temp = "星期二【" + formatTime(date) + "】"
                break
            case 1:
                temp = "星期三【" + formatTime(date) + "】"
                break
            case 2:
                temp = "星期四【" + formatTime(date) + "】"
                break
            case 3:
                temp = "星期五【" + formatTime(date) + "】"
                break
            case 4:
                temp = "星期六【" + formatTime(date) + "】"
                break
            default:
                temp = "星期日【" + formatTime(date) + "】"
                break
        }
        times.push(temp)
    }
    return times
}