const Koa     = require('koa');
const Router  = require('koa-router');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const static = require('koa-static');
const fs = require('fs');
const route = require('koa-route');



const jsn = require('koa-json');
const app     = new Koa();
const router  = new Router();
const cors = require('@koa/cors');
const Chatkit = require('@pusher/chatkit-server');
// const bcrypt = require('bcrypt');

// const users = [];
const chatkit = new Chatkit.default({
    instanceLocator: "v1:us1:cda0f940-152b-46e7-b38b-e20c2eb435de",
    key: "e5f05666-11e0-411a-91c5-4468c3222437:f4OBdcWIZuEOEm/fpodYKO10mRpBun7WugFE7n1rCGI="
});

function* index() {
    this.body = fs.readFileSync(path.resolve(path.join('build', 'index.html')), 'utf8')
}
app.use(route.get('*', index));
app.use(static(path.resolve('build')));
app.use(jsn());
// app.use(dbUsers());
app.use(bodyParser());
app.use(router.routes());
app.use(cors());


// app.use((ctx) =>{
//     ctx.body = users
// });

router.post('/users', createUser);
async function createUser(ctx, next) {
    const {username} = ctx.request.body;
    try {
        // const hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);
        // const user = {username: ctx.request.body.username, password: hashedPassword};
        // users.push(user);
        await chatkit.createUser({
            id: username,
            name: username
        });
        console.log(`User created: ${username}`);
        ctx.body = {message: "New user added"};
        console.log()
    }catch(err){
        console.error(err);
        ctx.body = {message: "User already exists"};
    }
    next();
}

// router.post('/users/login', userLogin);
// async function userLogin(ctx, next) {
//     const user = users.find(user => user.username === ctx.request.body.username);
//     if (user == null) {
//         return ctx.status(400).send('Cannot find user')
//     }
//     try{
//         if(await bcrypt.compare(ctx.request.body.password, user.password)) {
//             ctx.body={message: "success"}
//         }else {
//             ctx.body={message: "password not correct"}
//         }
//     }catch (err){
//         console.error(err);
//         ctx.body={err};
//     }
// }

router.post('/authenticate', authenticateUser);
async function authenticateUser(ctx,next) {
    try {
        const authData = chatkit.authenticate({userId: ctx.request.query.user_id});
        ctx.body = authData.body;

    } catch (err) {
        console.log(err.message)
    }
    next();
}

const port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log(`Listening on port: ${port}`)
});