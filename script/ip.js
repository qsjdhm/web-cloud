// let name = process.argv[2]
// /* 联调环境接口 */
// // let IPhost = '10.100.172.6:9114'.split(':')
// // let IPhost = 'master1.vtstar.net:31000'.split(':')
// // let IPhost = '10.100.172.56:9192'.split(':')
// // 当前项目的接口，由于项目都要1000监听容易重复，为了防止启动多个项目这里端口号进行递增
// const listenport = '60000'
// let connectaddress = IPhost[0]
// let connectport = IPhost[1]
// const path = require('path')
// let handleCmd = async (text) => {
//     let options = {
//         encoding: 'utf8',
//         timeout: 0,
//         maxBuffer: 200 * 1024,
//         killSignal: 'SIGTERM',
//         setsid: false,
//         cwd: path.join(__dirname, './'),
//         env: null
//     }
//     let exec = require('child_process').exec
//     return new Promise(async (resolve, reject) => {
//         exec(text, options, function (error, stdout, stderr) {
//             if (error) {
//                 reject(error)
//             } else {
//                 resolve(stdout)
//             }
//         })
//
//     })
// }
// (async () => {
//     try {
//         let show = 'netsh interface portproxy show  v4tov4'
//         let msg = ''
//         let bash = ''
//         switch (name) {
//             case 'yy':
//                 /* 桑志勇docker服务器本地联调地址 */
//                 connectaddress = '10.100.172.59'
//                 connectport = '30001'
//                 break
//             case 'yong':
//                 /* 桑志勇本地联调地址 */
//                 connectaddress = '10.100.172.56'
//                 connectport = '9192'
//                 break
//             case 'hu':
//                 // 薛虎的本地联调地址
//                 // http://10.100.172.43:8088/swagger-ui.html
//                 connectaddress = '10.100.172.43'
//                 connectport = '8088'
//                 break
//             case 'peng':
//                 /* 浩鹏本地联调的地址 */
//                 // http://10.100.172.28:9104/SERVICE-BUSINESS/swagger-ui.html
//                 connectaddress = '10.100.172.32'
//                 connectport = '9107'
//                 break
//             case 'show':
//                 msg = '<<端口已删除>>'
//                 bash = show
//                 break
//             case 'del':
//                 let del = `netsh interface portproxy delete v4tov4 listenport=${process.argv[3] || listenport}`
//                 bash = del
//                 msg = `<<端口已删除>> ${process.argv[3] || listenport}`
//                 break
//             default:
//                 msg = `<<端口已添加>>: connectaddress:${connectaddress} connectport: ${connectport}`
//         }
//         if (name !== 'del' && name !== 'show') {
//             bash = `netsh interface portproxy add v4tov4 listenport=${listenport} connectaddress=${connectaddress} connectport=${connectport}`
//             msg = `<<端口已添加>>: ${connectaddress}:${connectport}`
//         }
//         let res = await handleCmd(bash)
//         console.log('\x1B[32m%s\x1B[0m', res)
//         console.log('\x1B[32m%s\x1B[0m', msg)
//         // 控制的调戏提示
//         // 调用的node run api, 进行对应的更改的文档的处理
//     } catch (error) {
//         console.log('\x1B[31m%s\x1B[0m', error.message)
//     }
// })()
