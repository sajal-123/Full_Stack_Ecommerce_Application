import jwt from 'jsonwebtoken';

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        console.log("token", token);
        if (!token) {
            return res.status(401).json({
                message: "Please Login...!",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY || "bykudhsofy7es8shrf9r3qrgfeugh0ru3489thrjgh6r4hw49t0esjfndskue7", (err, decoded) => {
            if (err) {
                console.log("error auth", err);
                return res.status(403).json({
                    message: "Invalid or expired token",
                    error: true,
                    success: false
                });
            }

            req.userId = decoded._id;
            next();
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

export { authToken };
