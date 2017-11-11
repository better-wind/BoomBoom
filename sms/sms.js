const puppeteer = require('puppeteer');
const options = {
    username:'39897867813',
    password:'xc78W.comhss',
    phone:'13575510546'
}
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto('https://ssl.zc.qq.com/v3/index-chs.html');
    await page.type('#nickname', options.username, { delay: 100 });
    await page.type('#password', options.password, { delay: 100 });
    await page.type('#phone', options.phone, { delay: 100 });
    await page.click('#send-sms', { button: 'left' });
    await page.waitForSelector('.send-sms.disabled')
    await browser.close();


});