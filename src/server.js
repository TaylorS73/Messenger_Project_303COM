const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = require('path');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server');
// const bcrypt = require('bcrypt');

// const users = [];
const chatkit = new Chatkit.default({
    instanceLocator: "v1:us1:cda0f940-152b-46e7-b38b-e20c2eb435de",
    key: "e5f05666-11e0-411a-91c5-4468c3222437:f4OBdcWIZuEOEm/fpodYKO10mRpBun7WugFE7n1rCGI="
});

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// app.use(dbUsers());

// app.use((ctx) =>{
//     ctx.body = users
// });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/build/index.html'));
});


app.post('/users', (req, res) => {
    const { username } = req.body;
    chatkit.createUser({
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
});

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

app.post('/authenticate', authenticateUser);
async function authenticateUser(req,res) {
    try {
        const authData = chatkit.authenticate({userId: req.query.user_id});
        res.status(authData.status).send(authData.body);
    } catch (err) {
        console.log(err.message)
    }
}

const port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log(`Listening on port: ${port}`)
});