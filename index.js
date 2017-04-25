const Koa = require('koa');
const Serve = require('koa-static');

const app = new Koa();

app.use(Serve('src'));

app.listen('8050', function() {
    console.log('Server listening on port 8050');
});