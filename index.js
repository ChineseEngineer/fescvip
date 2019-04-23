const Koa = require('koa2')
const Router = require('koa-router')
const cheerio = require('cheerio')
const request = require('superagent')
const fs = require('fs')

const app = new Koa()
const router = new Router()

const paths = [
    {url: 'http://www.fescovip.com.cn/Business/GoodList?colid=0&jifen=1&searchar=&planid=11&selpinpai=0&duoxuanpp=&gysId=', pageSize: 2, size: 766},
    {url: 'http://www.fescovip.com.cn/Business/GoodList?colid=0&jifen=2&searchar=&planid=11&selpinpai=0&duoxuanpp=&gysId=', pageSize: 2, size: 1353},
    {url: 'http://www.fescovip.com.cn/Business/GoodList?colid=0&jifen=3&searchar=&planid=11&selpinpai=0&duoxuanpp=&gysId=', pageSize: 2, size: 373},
    {url: 'http://www.fescovip.com.cn/Business/GoodList?colid=0&jifen=4&searchar=&planid=11&selpinpai=0&duoxuanpp=&gysId=', pageSize: 2, size: 229},
    {url: 'http://www.fescovip.com.cn/Business/GoodList?colid=0&jifen=5&searchar=&planid=11&selpinpai=0&duoxuanpp=&gysId=', pageSize: 2, size: 78},
    {url: 'http://www.fescovip.com.cn/Business/GoodList?colid=0&jifen=6&searchar=&planid=11&selpinpai=0&duoxuanpp=&gysId=', pageSize: 2, size: 399},
]
const result = []
const process = []

function getData(paths) {
    paths.map((item, pathIndex) => {
        for (let index = 1; index <= item.size; index++) {
            console.log(index)
            request.get(item.url + 'pindex=' + index)
            .end((err, res) => {
                if(err){
                    console.log(err);
                    return ;
                }
                const $ = cheerio.load(res.text);
                const $html = $('#product ul li')
                $html.each((index, element) => {
                    const obj = {}
                    obj.title = $(element).find('.gl_name').text().replace('\n', '').trim()
                    obj.link = $(element).find('.gl_name a').attr('href')
                    obj.jf = +($(element).find('.jf dd').text().replace('积分：', ''))
                    obj.pic = $(element).find('.GoodListImg img').attr('src')
                    obj.from = $(element).find('.pro_jingdong').text()
                    result.push(obj)
                })
                process.push(pathIndex)
                if (process.length === 6) {
                    const resultStr = JSON.stringify(result)
                    fs.writeFile('./goodsData.json', resultStr, (err) => {
                        err && console.error(err)
                    })
                    console.log('爬虫完成.............................爬虫完成')
                }
            })
            
        }
    })
}

getData(paths)

router.get('/', (ctx) => {
    ctx.body = '爬虫学习...'
})

app.use(router.routes())
.use(router.allowedMethods())

app.listen(3000, () => {
    console.log('服务启动成功...')
})