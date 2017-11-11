var bodyParser  =  require('body-parser');
var express = require('express')
var path = require('path')
var App = require('./app')
var utils = require('./utils')
const chalk = require('chalk');
var app = express()
var router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
router.post('/sendPhone',function(req,res){

    var phone = req.body.phone
    console.log(phone)
    const options = {
        username:'18345271666',
        password:'xc78W.comhss',
        phone:phone
    }
    var app = new App(options)
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


app.use(router)
app.use(express.static(path.resolve(__dirname,'../')));

app.listen(3004)