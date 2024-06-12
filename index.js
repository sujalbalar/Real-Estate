import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import multer from 'multer';

import {register, login, logout} from './controllers/user.js';
import {getData, searchProperties} from './controllers/property.js';
import {options, transporter} from './mail/mail.js';
import connect from './config/db.js';
import propertyModel from './models/property.js'

import cookieParser from 'cookie-parser';
import session from 'express-session';
import auth from './middlewares/auth.js';
import { fetchCities, fetchStates } from './controllers/state-city.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let fileName = '';

const diskStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname + '/uploads/');
    },
    filename: function(req, file, cb){
        fileName = String(file.originalname);
        const len_of_file_name = fileName.length;
        const st_index_of_ext = fileName.indexOf('.');
        fileName = fileName.substring(0, st_index_of_ext) + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + fileName.substring(st_index_of_ext,len_of_file_name);
        cb(null, fileName);
    }
});

const upload = multer({storage: diskStorage});

const app = express();

app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use (bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser())
app.use(session({
    secret: 'abc',
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : 1000 * 60 * 60
    }
}));

const homePagePath = 'public/index.html';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,homePagePath));
});

app.get('/checkStatus', (req, res) => {
    if(req.session.userEmail)
        res.json({status : true });
    else
        res.json({status : false });
})

app.post('/register', register);

app.post('/login', login);

app.get('/logout', logout);

app.post('/send_message', auth, (req, res) => {
    options.bcc = req.session.userEmail;
    options.text = req.body.message;

    transporter.sendMail(options,  (err, info) => {
        if(err)
            console.log(err);
        else{
            console.log('Message Sent :: ' + info.response);
            res.redirect('contact.html');
        }
    });
});

app.get('/fetchStates', fetchStates);

app.get('/fetCities', fetchCities);

app.get('/getProps', getData);

app.post('/add-prop-data', auth, upload.single('file'), async (req, res) => {
    const filePath = path.join(__dirname,'uploads',fileName);
    console.log(filePath);
    if(fs.existsSync(filePath)){
        try{
            const filePath = path.join('../uploads', fileName);
            let {state, city, address, rent, price, size, type} = req.body;
            if(Array.isArray(size))
                size = size[1];
            
            const property = new propertyModel({ address : address, state : state, city : city, rent : rent, price : price, type : type, size : size, imgUrl : filePath});

            await property.save();
            res.status(200).sendFile(path.join(__dirname,'public/add-property.html'));
        }
        catch(err){
            fs.unlinkSync(filePath);
            console.log(err);
            res.status(400).send('Data insertion failed.  please try again.')
        };
    }
    else{
        res.status(400).json({msg : 'File upload failed.'});
    }
});

app.get('/searchProps', searchProperties);

app.listen(9999, () => {
    console.log('Server running on 9999 port.');
});