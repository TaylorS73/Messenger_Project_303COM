const Koa     = require('koa');
const Router  = require('koa-router');
const koaBody = require('koa-body');

const app     = new Koa();
const router  = new Router();

const cors    = require('cors');
const Chatkit = require('@pusher/chatkit-server');

const chatkit = new Chatkit.default({
    instanceLocator: "v1:us1:cda0f940-152b-46e7-b38b-e20c2eb435de",
    key: "e5f05666-11e0-411a-91c5-4468c3222437:f4OBdcWIZuEOEm/fpodYKO10mRpBun7WugFE7n1rCGI="
});

app.use(koaBody());
app.use(router.routes());
app.use(cors());

router.post('/users', createUser);
async function createUser(ctx, next) {
    const {username} = ctx.request.body;
    try {
        await chatkit.createUser({
            id: username,
            name: username
        });
        console.log(`User created: ${username}`);
        ctx.body = {message: "New user added"};
    }catch(err){
        console.log(`User already exists: ${username}`);
        ctx.body = {message: "User already exists"};
    }
    next();
}

app.listen(8080, () => console.log('App is listening on port 8080!'));