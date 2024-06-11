import nodemailer from 'nodemailer';

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
}

export {options, transporter};