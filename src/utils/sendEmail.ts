import nodemailer from 'nodemailer';

export const sendVerificationEmail = async(to:string,code:number)=>{
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport(
        {
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        }
    );
    const info = await transporter.sendMail({
        from: '"My App" <no-reply@myapp.com>',
        to,
        subject: "Verify your account",
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <b>${code}</b></p>`,
    });
    console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
}