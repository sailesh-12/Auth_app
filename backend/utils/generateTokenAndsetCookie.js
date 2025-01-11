const jwt=require('jsonwebtoken');

module.exports.generateTokenandSetCookie=(res,userId)=>{
	const token=jwt.sign({userId},process.env.JWT_TOKEN,{expiresIn:'30d'});
	res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',expiresIn:'30d'});
	return token;
}