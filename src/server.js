// const Koa     = require('koa');
// const router  = require('koa-router')();
const bodyParser = require('body-parser');
const express = require('express');
// const app     = new Koa();
const app     =  express();
const cors    = require('cors');
const Chatkit = require('@pusher/chatkit-server');

const chatkit = new Chatkit.default({
    instanceLocator: "v1:us1:cda0f940-152b-46e7-b38b-e20c2eb435de",
    key: "e5f05666-11e0-411a-91c5-4468c3222437:f4OBdcWIZuEOEm/fpodYKO10mRpBun7WugFE7n1rCGI="
});

app.post('/users', (req, res) => {
    const { username } = req.body
    chatkit
        .createUser({
            id: username,
            name: username
        })
        .then(() => res.sendStatus(201))
        .catch(error => {
            if (error.error === 'services/chatkit/user_already_exists') {
                res.sendStatus(200)
            } else {
                res.status(error.status).json(error)
            }
        })
})

// router.post('/users', bodyParser(), createUser);
// async function createUser(ctx, next) {
//     const {username} = ctx.request.body;
//     try{
//         await chatkit.createUser({
//             id: username,
//             name: username
//         });
//         ctx.body = {message: "New user added"};
//     }catch(err){
//         ctx.statusCode = err.status;
//         ctx.body = {message: err.message};
//     }
//     next();
// }

// router.post('/users', (req,res) =>{
//     const { username } = req.body;
//     chatkit.createUser({
//             id: username,
//             name: username
//         })
//         .then(() => res.sendStatus(201))
//         .catch(error => {
//             if (error.error_type === 'services/chatkit/user/user_already_exists'){
//                 res.sendStatus(200)
//             } else {
//                 res.status(error.statusCode).json(error)
//             }
//         })
// });


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
// app.use(router.routes());
// app.use(router.allowedMethods());
app.listen(8080, () => console.log('App is listening on port 8080!'));