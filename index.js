// const express = require('express')
// const cors = require('cors')
// const app = express()
// const nodemailer = require('nodemailer')
// app.use(express())
// app.use(express.json())
// // app.use(cors(
// //     {
// //         origin:"https://strategicinvestments.ae/"
// //     }
// // ))
// app.use(cors())
// app.listen(3000,()=>{
//     console.log('server is running');
// })
// const transporter = nodemailer.createTransport({
//     host: 'smtp.hostinger.com',
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//         user: 'info@strategicinvestments.ae', // One of your Hostinger emails
//         pass: 'Info1234567.' // The password for this specific email account
//     }
// });

// // Define a route to send emails
// app.post('/send-email', async (req, res) => {
//     const { to, subject, text, html } = req.body;

//     // Validate the "to" email address
//     const validEmails = ['info@strategicinvestments.ae', 'hr@strategicinvestments.ae'];
//     if (!validEmails.includes(to)) {
//         return res.status(400).send({ message: 'Invalid recipient email address' });
//     }

//     const mailOptions = {
//         from: 'your-email@yourdomain.com', // Sender address
//         to: to, // Recipient email address from request body
//         subject: subject, // Subject line
//         text: text, // Plain text body
//         html: html // HTML body
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         res.status(200).send({
//             message: 'Email sent successfully',
//             messageId: info.messageId
//         });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send({ message: 'Error sending email', error: error.message });
//     }
// });
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { default: mongoose } = require('mongoose');
const adminModel = require('./models/adminModel');
const emailModel = require('./models/emailModel');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'https://strategicinvestments.ae'
}));
// app.use(cors())
mongoose.connect('mongodb+srv://muarif961octaloop:xB7epSldwCZyY1hO@cluster0.yxx5mys.mongodb.net/strategy')
.then(()=>{

    console.log('database connected');
})

// Configure Nodemailer for Hostinger's email service with Outlook
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'hr@strategicinvestments.ae', // Your email address registered on Hostinger
        pass: 'Hr@1234567.' // Your email password for Hostinger
    }
});

// Define a route to send emails
app.post('/send-email', async (req, res) => {
    console.log(req.body,'body');
    const { recipient, name, email, message } = req.body;

    // Validate the "recipient" email address
    const validEmails = ['info@strategicinvestments.ae', 'hr@strategicinvestments.ae'];
    if (!validEmails.includes(recipient)) {
        return res.status(400).send({ message: 'Invalid recipient email address' });
    }

    const mailOptions = {
        // from: email, // Sender address based on form input
        to: recipient, // Recipient email address based on form input
        subject: 'New Message from Contact Form', // Subject line
        text: `Name: ${name}\nFrom: ${email}\n\nMessage: ${message}`, // Plain text body
        html: `<p>Name: ${name}</p><p>From: ${email}</p><p>Message:</p><p>${message}</p>` // HTML body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).send({
            message: 'Email sent successfully',
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Error sending email', error: error.message });
    }
});
app.post('/login',async(req,res)=>{
    try {
        
      var response = await adminModel.findOne({email:req.body.email,password:req.body.password})
      if(!response){
        res.status(401).send({ message: 'Incorrect Username or password' });

      }
      if(response){
        res.status(200).send({ message: 'Admin has Login',response });
        
      }
     

        
    } catch (error) {
        
    }
})
app.post('/create-email',async(req,res)=>{
    console.log(req.body,'')
    try {
        
      var response = await emailModel.findOne({mail:req.body.mail})
     
      if(response){
        res.status(200).send({ message: 'Email already exists' });
        
      }
      if(!response){
        var response = await emailModel.create(req.body)
      console.log(response);

        res.status(200).send({message:'Email added'})
      }
     

        
    } catch (error) {
        console.log(error);
        
    }
})
app.get('/send-emails', async(req,res)=>{
    try {
        var response = await emailModel.find({})
       
        res.status(200).send({response})
    } catch (error) {
        console.log(error);
    }
}

 
)
app.delete('/delete-email/:id',async(req,res)=>{
    console.log(req.params,'params');
    try {
        var response = await emailModel.findByIdAndDelete(req.params.id)
        var object = await emailModel.find({})
        res.json(object)


        
    } catch (error) {
        
    }
})
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

