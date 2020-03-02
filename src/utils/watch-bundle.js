/**
 * 1、通过webpack plugin 监听本地router 文件下的内容是否改变
 * 2、改变后，向服务端发送当前本地路由
 */
import getRoutes from '@/utils/generateRouter'
import service from '@/utils/service'
export const watchRoute = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let routerList = getRoutes()
            // await service('post', '/SERVICE-SYSTEM/api/v1/resource/list', routerList, () => {})      // 向后台发送当前权限表
            let authorityList = await service('get', '/SERVICE-SYSTEM/api/v1/user/resource/list', {},() => {})        // 获取重新获取权限列表存放于本地
            window.sessionStorage.setItem('Admin-Authority', JSON.stringify(authorityList))
            resolve()
        } catch (error) {
            console.log('\x1B[32m%s\x1B[0m', '监听路由，发送文件出现问题，可忽略.......')
            reject(error)
        }
    })
}
