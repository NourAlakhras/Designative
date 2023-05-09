const nodemailer = require("nodemailer");

function sendEmailResponse(email, message, subject) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //server to use
    port: 587,
    auth: {
      user: "designative.team@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // ignore self-signed certificate error
    },
  });
  const mailOptions = {
    from: "designative.team@gmail.com",
    to: email,
    subject: subject,
    text: message,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return error.message;
    } else {
      return true;
    }
  });
}

exports.index = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.render("general-homepage", {
      path: "/",
      name: req.session.user.firstname,
    });
  }
  res.render("homepage", { path: "/" });
};

exports.contactUs = (req, res) => {
  res.render("contact_us", { path: "/contact" });
};

exports.sendEmail = (req, res) => {
  const messageToAdmin = `Hi my name is ${req.body.name} and my email is ${req.body.email} and my message is ${req.body.message}`;
  const messageToClient = `Dear (${req.body.name})

You've reached Designative!
We appreciate you taking the time to reach out, and one of our support team members will be in touch with you shortly. 
  
Thanks for getting in touch! We know how important it is to get immediate help which is why we promise to do everything we can to get back to you as soon as possible.
  
Best regards,
Designative team.`;
//admin email
  sendEmailResponse("designative_team@hotmail.com", messageToAdmin, "New message from contact form");
  sendEmailResponse(req.body.email, messageToClient, "New Ticket.");
  res.redirect("/contact");
};

exports.FAQ = (req, res) => {
  res.render("faq", { path: "/faq" });
};

exports.aboutUs = (req, res) => {
  res.render("about_us", { path: "/about" });
};
