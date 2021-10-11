/**
 * Created by zzhZhou on 2020/5/14.
 */
module.exports = {
    devServer: {
        // host: "0.0.0.0",
        // port: 8080, // 端口号
        // https: false, // https:{type:Boolean}
        open: false, //配置自动启动浏览器
        proxy: {
            '/api': {
                target: 'https://my-wyyapi-zzhzhou.vercel.app/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/music': {
                target: 'https://music.163.com/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/music': ''
                }
            },
            '/mv' : {
                target: 'https://st.music.163.com/mlog/mlog.html',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                  '^/mv': ''
                }
            }
        },
        // publicPath: './'
    },
    lintOnSave: false,
}
