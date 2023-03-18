const bcrypt = require("bcrypt");
const UserModel = require("../../models/user");
const Token = require("../../models/token");
const { sendVerificationEmail } = require("../../middlewares/email");

module.exports = {
    authenticate: async function (req, res, next) {
        if (req.body.UserName) {
            await UserModel.find({ UserName: req.body.UserName })
                .then(async (userInfo) => {
                    if (userInfo.length == 0) {
                        res.json({
                            status: "error",
                            message: "Invalid Username!!!",
                            data: null,
                        });
                        console.log(userInfo[0])
                    } else {
                        await sendVerificationEmail(userInfo[0], req, res, false);
                    }
                })
                .catch((err) => {
                    res.json({ status: "error", message: err, data: null });
                });
        } else {
            res.json({ status: "error", message: "incomplete info", data: null });
        }
    },
    verify: async (req, res) => {
        if (req.body.Password) {
            if (!req.params.token)
                return res
                    .status(400)
                    .json({ message: "We were unable to find a user for this token." });
            try {
                // Find a matching token
                const token = await Token.findOne({ token: req.params.token, verify: false });
                if (!token) return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });    
                // If we found a token, find a matching user
                User.findOne({ _id: token.userId }, async (err, user) => {
                    if (!user)
                        return res
                            .status(400)
                            .json({
                                message: "We were unable to find a user for this token.",
                            });
                    // Update the password of the user and save the user
                    user.password = req.body.Password;
                    try{
                        await user.save();
                    }catch{
                        res.status(500).json({ message: error.message });
                    }
                    res.status(200).json({ message: "Password Updated Successfully" });
                });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        } else {
            res.json({ status: "error", message: "incomplete info", data: null });
        }
    },  
};
