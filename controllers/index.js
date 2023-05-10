// Importing nodemailer library
const nodemailer = require("nodemailer");

// Defining function to send email response
function sendEmailResponse(email, message, subject) {
  // Creating nodemailer transporter object with smtp.gmail.com as host
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Server to use
    port: 587, // Port to use
    auth: {
      user: "designative.team@gmail.com", // Sender email address
      pass: process.env.EMAIL_PASSWORD, // Sender email password
    },
    tls: {
      rejectUnauthorized: false, // Ignore self-signed certificate error
    },
  });
  // Defining email options
  const mailOptions = {
    from: "designative.team@gmail.com", // Sender email address
    to: email, // Recipient email address
    subject: subject, // Email subject
    text: message, // Email message
  };
  // Sending email with defined options
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) { // If there is an error, log it to console and return error message
      console.error(error);
      return error.message;
    } else { // Otherwise, return true
      return true;
    }
  });
}

// Exporting function to render index page
exports.index = (req, res) => {
  if (req.session.isLoggedIn) { // If user is logged in, render general-homepage with user's first name
    return res.render("general-homepage", {
      path: "/",
      name: req.session.user.firstname,
    });
  }
  // Otherwise, render homepage
  res.render("homepage", { path: "/" });
};

// Exporting function to render contact us page
exports.contactUs = (req, res) => {
  res.render("contact_us", { path: "/contact" });
};

// Exporting function to send email response
exports.sendEmail = (req, res) => {
  // Defining message to be sent to admin
  const messageToAdmin = `Hi my name is ${req.body.name} and my email is ${req.body.email} and my message is ${req.body.message}`;
  // Defining message to be sent to client
  const messageToClient = `Dear (${req.body.name})

You've reached Designative!
We appreciate you taking the time to reach out, and one of our support team members will be in touch with you shortly. 
  
Thanks for getting in touch! We know how important it is to get immediate help which is why we promise to do everything we can to get back to you as soon as possible.
  
Best regards,
Designative team.`;
  // Sending email responses to admin and client
  sendEmailResponse("designative_team@hotmail.com", messageToAdmin, "New message from contact form");
  sendEmailResponse(req.body.email, messageToClient, "New Ticket.");
  // Redirecting to contact page
  res.redirect("/contact");
};

// Exporting function to render FAQ page
exports.FAQ = (req, res) => {
  res.render("faq", { path: "/faq" });
};

// Exporting function to render about us page
exports.aboutUs = (req, res) => {
  res.render("about_us", { path: "/about" });
};
