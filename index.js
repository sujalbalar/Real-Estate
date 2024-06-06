import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import nodemailer from 'nodemailer';
import session from 'express-session';
import { State, City } from 'country-state-city';
import { statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COUNTRY_CODE = 'IN';
var states = [];

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

app.post('/login', (req, res) => {
   const {email, password} = req.body;
   res.send(email);
});

app.post('/signup', (req, res) => {
    const {email, password, cfrmPassword} = req.body;   
    res.send(email);
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
        bcc : 'sujalbalar316@gmail.com',
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

app.get('/fetchData', (req, res) => {
    states = State.getStatesOfCountry(COUNTRY_CODE);
    res.status(200).json({data : states.map(state => {
        return state.name;
    })});
});

app.get('/fetCities', (req, res) => {
    const selectedState = req.query.selectedState;
    const stateCode = states.find(state => {
        if(state.name === selectedState){
            return state;
        }
    }).isoCode;

    const cities = City.getCitiesOfState(COUNTRY_CODE,stateCode);
    res.status(200).json({data : cities.map(city => {
        return city.name;
    })});
})

app.get('/add-prop-data', (req, res) => {
    res.sendFile('add-property.html');
});

app.listen(9999, () => {
    console.log('Server running on 9999 port.');
});