const nodemailer=require('nodemailer');
const path=require('path');
const ejs=require('ejs')
const sendEmail=async(options)=>{
    const  transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:parseInt(process.env.SMTP_PORT||'587'),
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        }
        

    })
    const {email,subject,template,data}=options;
    // get the path to the email template file.....................................
    const templatePath=path.join(__dirname,'../mails',template);
    // Render the email template with EJS ............
    const html=await ejs.renderFile(templatePath,data);
    const mailOptions={
        from:process.env.SMTP_MAIL,
        to:email,
        subject,
        html
    }
    await transporter.sendMail(mailOptions)


}

module.exports=sendEmail