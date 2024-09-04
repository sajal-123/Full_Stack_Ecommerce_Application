import bcrypt from 'bcryptjs';
import { userModel } from '../../models/userModel.js';
import jwt from 'jsonwebtoken';

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body.data;
        console.log(email,password)

        if (!email) {
            throw new Error("Please provide email");
        }
        if (!password) {
            throw new Error("Please provide password");
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        console.log("checkPassword", checkPassword);

        if (checkPassword) {
            const tokenData = {
                _id: user._id,
                email: user.email,
            };
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY || "bykudhsofy7es8shrf9r3qrgfeugh0ru3489thrjgh6r4hw49t0esjfndskue7", { expiresIn: '8h' });

            const tokenOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 8 * 60 * 60 * 1000 // 8 hours in milliseconds
            };

            res.cookie("token", token, tokenOptions);
            res.status(200).json({
                message: "Login successfully",
                data: token,
                success: true,
                error: false
            });

        } else {
            throw new Error("Please check your password");
        }
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

export { userSignInController };
