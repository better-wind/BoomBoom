var bodyParser  =  require('body-parser');
var express = require('express')
var path = require('path')
var App = require('./app')
var utils = require('./utils')
const chalk = require('chalk');
const fs = require('fs-extra');
const config = require('./config');
// const Chromium = require('./chromium');
var app = express()
var router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
router.post('/sendPhone',function(req,res){

    var phone = req.body.phone
    const options = {
        username:phone,
        password:'xc78W.comhss',
        phone:phone
    }
    var app = new App(options)
    // app.init(async () => {
    //     // 运行时检查是已安装Chromium
    //     if ((await Chromium.isExist) === false) {
    //         // 查看本地是否有缓存
    //         if ((await Chromium.isExistLocalCache) === true) {
    //             await fs.copy(Chromium.cacheChromiumPath, Chromium.localChromiumPath);
    //         } else {
    //             // 如果没有缓存，则进行下载
    //             console.info(`Can not found the Chromium!`);
    //             console.info(`Downloading Chromium...`);
    //             try {
    //                 await Chromium.download();
    //             } catch (err) {
    //                 console.error(
    //                     `Please make sure ${chalk.green('chromium')} have install at ${chalk.yellow(
    //                         path.join(config.paths.puppeteer, '.local-chromium')
    //                     )}`
    //                 );
    //                 console.error(
    //                     `Try to reinstall: ${chalk.green(
    //                         'node ' + path.join(config.paths.puppeteer, 'install.js')
    //                     )}\n`
    //                 );
    //
    //                 console.info(
    //                     `If you got network trouble, You can download ${chalk.green(
    //                         Chromium.downloadUrl
    //                     )} by your self and extract to ${chalk.yellow(Chromium.path)}`
    //                 );
    //                 throw err;
    //             }
    //         }
    //     } else {
    //         // 缓存Chromium，防止重复下载
    //         await fs.ensureDir(Chromium.cacheChromiumPath);
    //
    //         // 子目录
    //         const subPath = Chromium.platform + '-' + Chromium.revision;
    //         // 最后缓存的目标路径
    //         const targetPath = path.join(Chromium.cacheChromiumPath, subPath);
    //
    //         // 如果不存在，则缓存起来
    //         if ((await fs.pathExists(targetPath)) === false) {
    //             await fs.copy(path.join(Chromium.localChromiumPath, subPath), targetPath);
    //         }
    //     }
    // });
    app.resolveProvider()
        .on('open', () => {
            console.info(`打开浏览器...`);
        })
        .on('next', (currentTarget) => {
            utils.info(`进入到 ${chalk.green(currentTarget.name)} ${chalk.green.underline(currentTarget.url)}`);
        })
        .on('error', err => {
            console.error(err);
        })
        .emit('bootstrap')
    const data = {
        code:1,
        data:{}
    }
    res.send(JSON.stringify(data))
    res.end()

})

const options = {
    username:'1241241',
    password:'xc78W.comhss',
    phone:'13575510546'
}
var appA = new App(options)
// app.init(async () => {
//     // 运行时检查是已安装Chromium
//     if ((await Chromium.isExist) === false) {
//         // 查看本地是否有缓存
//         if ((await Chromium.isExistLocalCache) === true) {
//             await fs.copy(Chromium.cacheChromiumPath, Chromium.localChromiumPath);
//         } else {
//             // 如果没有缓存，则进行下载
//             console.info(`Can not found the Chromium!`);
//             console.info(`Downloading Chromium...`);
//             try {
//                 await Chromium.download();
//             } catch (err) {
//                 console.error(
//                     `Please make sure ${chalk.green('chromium')} have install at ${chalk.yellow(
//                         path.join(config.paths.puppeteer, '.local-chromium')
//                     )}`
//                 );
//                 console.error(
//                     `Try to reinstall: ${chalk.green(
//                         'node ' + path.join(config.paths.puppeteer, 'install.js')
//                     )}\n`
//                 );
//
//                 console.info(
//                     `If you got network trouble, You can download ${chalk.green(
//                         Chromium.downloadUrl
//                     )} by your self and extract to ${chalk.yellow(Chromium.path)}`
//                 );
//                 throw err;
//             }
//         }
//     } else {
//         // 缓存Chromium，防止重复下载
//         await fs.ensureDir(Chromium.cacheChromiumPath);
//
//         // 子目录
//         const subPath = Chromium.platform + '-' + Chromium.revision;
//         // 最后缓存的目标路径
//         const targetPath = path.join(Chromium.cacheChromiumPath, subPath);
//
//         // 如果不存在，则缓存起来
//         if ((await fs.pathExists(targetPath)) === false) {
//             await fs.copy(path.join(Chromium.localChromiumPath, subPath), targetPath);
//         }
//     }
// });
appA.resolveProvider()
    .on('open', () => {
        console.info(`打开浏览器...`);
    })
    .on('next', (currentTarget) => {
        utils.info(`进入到 ${chalk.green(currentTarget.name)} ${chalk.green.underline(currentTarget.url)}`);
    })
    .on('error', err => {
        console.error(err);
    })
    .emit('bootstrap')

app.use(router)
app.use(express.static(path.resolve(__dirname,'../')));

app.listen(3004)