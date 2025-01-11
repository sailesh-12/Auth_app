const bcrypt = require('bcryptjs');
const User = require('../models/usermodel');
const crypto = require('crypto');
const { generateTokenandSetCookie } = require('../utils/generateTokenAndsetCookie');
const { generateVerificationCode } = require('../utils/generateVerificationcode');
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail , sendSuccessEmail} = require('../mailtrap/emails')

module.exports.signup = async (req, res, next) => {
	const { email, password, name } = req.body;
	console.log(email, password, name);

	try {
		if (!email || !password || !name) {
			return res.status(400).json({ error: 'All fields are required' });
		}

		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ error: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = generateVerificationCode();

		const newUser = new User({
			email, password: hashedPassword,
			name,
			verificationToken, verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000
		});

		await newUser.save();
		generateTokenandSetCookie(res, newUser._id);
		await sendVerificationEmail(newUser.email, verificationToken);


		// Using newUser here instead of user
		res.status(200).json({
			message: 'User registered successfully',
			user: {
				...newUser._doc,  // Fix: use newUser
				password: undefined,
			}
		});
	} catch (error) {
		console.error('Error during signup:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};


module.exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	console.log(email, password);

	try {
		if (!email || !password) {
			return res.status(400).json({ error: 'All fields are required' });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: 'User not found' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			console.log('Incorrect password');
			
			return res.status(401).json({ error: 'Incorrect password' });

		}
		generateTokenandSetCookie(res, user._id);
		user.lastLogin=new Date();
		await user.save();
		
		res.status(200).json({
			message: 'Login successful',
			user: {
				...user._doc,
				password: undefined,
			}
		});
		console.log('Login successful', user);
		
	} catch (error) {
		console.error('Error during login:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};
module.exports.logout = async (req, res, next) => {
	res.clearCookie('token');
	res.status(200).json({ message: 'Logout successful' });

};
module.exports.verifyEmail = async (req, res) => {
	const { code } = req.body;
	console.log("Verification code received:", code);  // Debug log

	try {
		const user = await User.findOne({ verificationToken: code });

		// Log the token from the database to debug
		/*console.log("Stored verification token:", user ? user.verificationToken : "User not found");*/

		if (!user) {
			return res.status(400).json({ error: 'Invalid Verification Code' });
		}

		// Check if the verification token has expired
		if (user.verificationTokenExpires < Date.now()) {
			return res.status(400).json({ error: 'Verification code has expired' });
		}

		user.isVerified = true;
		user.verificationToken = '';
		user.verificationExpires = '';

		await user.save();
		await sendWelcomeEmail(user.email, user.name);

		res.json({
			message: 'Email verified successfully',
			success: true,
			user: {
				...user._doc,
				password: undefined,
				verificationToken: undefined,
				verificationTokenExpires: undefined
			}
		});

	} catch (error) {
		console.error('Error during verification:', error);
		if (!res.headersSent) {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
};
module.exports.forgotPassword=async(req,res)=>{
	const {email}=req.body;
	try{
		const user=await User.findOne({email});
		if(!user){
			return res.status(400).json({error:"User not found"});
		}
		const resetToken=crypto.randomBytes(20).toString('hex');
		user.resetPasswordToken=resetToken;
		user.resetPasswordExpires=Date.now()+24*60*60*1000;
		await user.save();
		await sendPasswordResetEmail(user.email,`http://localhost:5173/reset-password/${resetToken}`);
		res.status(200).json({message:"Reset password token sent successfully"});

	}catch(error){
		console.error("Error sending reset password token:",error);
		res.status(500).json({error:"Internal server error"});
	}
}

module.exports.resetPassword = async (req, res) => {
    const { resetToken } = req.params;
	console.log("Reset token received:", resetToken);
	
    const { password } = req.body;

    try {
        // Validate password
        if (!password || password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        // Find user by reset token
        const user = await User.findOne({ resetPasswordToken: resetToken });
        if (!user) {
            return res.status(400).json({ error: "Invalid reset token" });
        }

        // Check if token has expired
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ error: "Reset token has expired" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user details
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send success email (optional)
        await sendSuccessEmail(user.email);

        // Respond with success
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(`[ResetPassword] Error for token ${resetToken}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
};
module.exports.checkAuth=async(req,res)=>{
	const user = await User.findById(req.userId).select("-password");
	try{
		if(!user){
            return res.status(401).json({error:"User not found"});
        }
        req.user=user;
		res.json({message:"User authenticated successfully",user});
		console.log("User authenticated successfully",user);
		
  
	}catch(error){
		console.error("Error checking authentication:",error);
		res.status(500).json({error:"Internal server error"});
	}

}