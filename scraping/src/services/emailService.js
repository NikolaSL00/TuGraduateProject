const nodemailer = require("nodemailer");

const sendEmail = (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.abv.bg",
    port: 465,
    auth: {
      //   user: "niikoola@abv.bg",
      //   password: ''
    },
  });

  const mailOptions = {
    from: "niikoola@abv.bg",
    to: "niikoola@abv.bg",
    subject: "Pak schupi neshto",
    text: `This is a test email from your Express server! In scraper ${data.name}, this went wrong ${data.error}`,
  };

  // Send the email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

exports.sendEmail = sendEmail;
