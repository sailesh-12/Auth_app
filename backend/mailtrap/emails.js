const { mailtrap, sender } = require("./mailtrap");
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailstemplates");

module.exports.sendVerificationEmail = async (email, verificationToken) => {
  console.log("Sending verification email...");
  
  try {
    const response = await mailtrap.send({
      from: sender,
      to: [{ email }],
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "verification"
    });

    console.log("Verification email sent successfully!", response);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

module.exports.sendWelcomeEmail = async (email, name) => {
	console.log("Sending welcome email...");
  
	const recipient = [{ email }];
	try {
	  const response = await mailtrap.send({
		from: sender,
		to: recipient,
		subject: "Welcome to Auth Company", // simple subject
		html: `<h1>Welcome, ${name}!</h1><p>We're glad to have you on board.</p>`,
	  });
  
	  console.log("Welcome email sent successfully!", response);
	} catch (error) {
	  console.error("Error sending welcome email:", error);
	}
  };

module.exports.sendPasswordResetEmail = async (email, resetToken) => {
	console.log("Sending password reset email...");
	try {
		const response = await mailtrap.send({
            from: sender,
            to: [{ email }],
            subject: "Password Reset Request",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", `http://localhost:5173/reset-password/${resetToken}`),
            category: "password-reset"
        });
		

		console.log("Password reset email sent successfully!", response);
	} catch (error) {
		console.error("Error sending password reset email:", error);
    }
};
module.exports.sendSuccessEmail=async(email)=>{
	console.log("Sending password reset email...");
	try {
		const response = await mailtrap.send({
			from: sender,
			to: [{ email }],
			subject: "Password Reset Request",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "password-reset"
		});
		
        console.log("Password reset email sent successfully!", response);
		
    } catch (error) {
		console.error("Error sending password reset email:", error);
	}
	
}