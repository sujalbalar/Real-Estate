import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import nodemailer from 'nodemailer';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use (bodyParser.json());

app.use(session({
    secret: 'abc'
}));

const homePagePath = 'public/index.html';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,homePagePath));
});

app.post('/send_message', (req, res) => {
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        host : 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'search.home.bharat@gmail.com',
            pass: 'azag gvzt ensp utkv'
        }
    });

    const options = {
        to : 'search.home.bharat@gmail.com',
        subject : 'Enquiry',
        text : req.body.message
    }

    transporter.sendMail(options, (err, info) => {
        if(err)
            console.log(err);
        else{
            console.log('Message Sent :: ' + info.response);
            res.redirect('contact.html');
        }
    })
});

app.listen(9999, () => {
    console.log('Server running on 9999 port.');
})