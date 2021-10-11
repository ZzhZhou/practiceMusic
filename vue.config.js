/**
 * Created by zzhZhou on 2020/5/14.
 */
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'my-wyyapi-zzhzhou.vercel.app', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/music': {
                target: ' https://music.163.com/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/music': ''
                }
            }
        }
    },
    lintOnSave: false
}
