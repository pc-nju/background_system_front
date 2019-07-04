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
                } else if (component.startsWith("Emp")) {
                    require(['../pages/emp/' + component + '.vue'], resolve)
                } else if (component.startsWith("Per")) {
                    require(['../pages/personnel/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sal")) {
                    require(['../pages/salary/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sta")) {
                    require(['../pages/statistics/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sys")) {
                    require(['../pages/system/' + component + '.vue'], resolve)
                } else if (component.startsWith("Class")) {
                    require(['../pages/class/' + component + '.vue'], resolve)
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