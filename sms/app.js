const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pTimeout = require('p-timeout');
const chalk = require('chalk');
const { shuffle } = require('lodash');
const utils = require('./utils');


class App extends EventEmitter {
    constructor(options = {}){
        super()
        this.options = options
        this.entities = []
        this.providers = []
        this.initer = [];
        this.on('bootstrap', async () => {
            try {
                const initer = this.initer;
                // init before bootstrap all
                while (initer.length) {
                    const initFunc = initer.shift();
                    await initFunc();
                }
            } catch (err) {
                console.error(`Boomer init fail...`);
                this.emit('error', err);
                process.exit(1);
            }
            this.bootstrap()
        });

    }
    init(func){
        this.initer.push(func);
        return this;
    }

    async run(){
        try {
            this.emit('open', this);
            this.browser = await puppeteer.launch({
                headless: false,
                // executablePath: 'C:\\Users\\weili\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe',
                executablePath: 'F:\\google\\chrome-win32\\chrome.exe'
            })
            this.page = await this.browser.newPage()
            await this.page.setViewport({
                width: 1366,
                height: 768
            })
            this.page.on('dialog', async dialog => {
                await dialog.dismiss();
            })
            const entities = this.entities
            for(let i = 0,j= entities.length;i<j;i++){
                const entity = entities[i]
                // if(!entity.along) return;
                try {
                    this.emit('next', entity)
                    await this.page.goto(entity.url, {
                        // networkIdleTimeout: 5000,
                        // networkIdleTimeout:3000,
                        // networkIdleTimeout:3000,
                        networkidle2: 'networkidle',
                        timeout: 3000000
                    })
                    await this.page.deleteCookie();
                    // 60s超时用于处理发送短信，不会导致无线等待的情况...
                    await pTimeout(entity.resolve(this), 1000 * 60)
                        .then(() => {
                            utils.log(chalk.green('[Success]:'), entity.name);
                            return Promise.resolve();
                        })
                        .catch(err => {
                            // 等待超时，忽略掉
                            utils.log(chalk.red('[Fail]:'), entity.name);
                            // 如果是等待超时
                            // 则很有可能是验证是否发送成功
                            if (err instanceof Error && err.message.indexOf('waiting failed') >= 0) {
                                return Promise.resolve();
                            } else if (err) {
                                return Promise.reject(err);
                            }
                        });
                } catch (err) {
                    this.emit('error', err);
                } finally {
                    await utils.sleep(2000);
                }

            }
            await this.close();
        } catch (err) {
            this.emit('error', err);
        }


    }

    async close(){
        const browser = this.browser
        browser && (await browser.close())
    }

    resolveProvider(){
        const _path = path.join(__dirname,'./providers')
        const files = fs.readdirSync(_path) || []
        while(files.length){
            const file = files.shift()
            const _filePath = path.join(_path,file)
            const Provider = require(_filePath)
            Provider.file = _filePath
            this.providers.push(Provider);
        }
            // const file = files[0]
            // const _filePath = path.join(_path,file)
            // const Provider = require(_filePath)
            // Provider.file = _filePath
            // this.providers.push(Provider);
        return this
    }
    async bootstrap(){
        const entities = this.providers
            .map(Provider => {
                const entity = new Provider(this)
                const fileInfo = path.parse(Provider.file);
                entity.name = fileInfo.name;
                entity.file = Provider.file;
                return entity
            })
        this.entities = entities
        while (process) {
            await this.run();
            // take a rest then let's go...
            await utils.sleep(1000 * 10);
        }
    }
}

module.exports =  App