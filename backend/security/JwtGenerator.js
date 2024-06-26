const crypto = require('crypto');
const secretKey = generateSecretKey();
const jwt = require('jsonwebtoken');

function generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
}

class JwtGenerator {
    static generateToken(id, role, expiresIn) {
        return jwt.sign({ id, role }, secretKey, { expiresIn });
    }

    static verifyToken(req, res, next) {
        const accessToken = JwtGenerator.getCookieFromRequest(req,'accessToken');
        if (!accessToken) return res.status(401).send('Unauthorized: No token provided');

        jwt.verify(accessToken, secretKey, (err, decoded) => {
            if (err) return res.status(401).send('Unauthorized: Invalid token');
            else {
                req.user = decoded;
                next();
            }
        });
    }
    static decodeToken(req, res, next) {
        const accessToken = JwtGenerator.getCookieFromRequest(req,'accessToken');
        if (accessToken) {
            jwt.verify(accessToken, secretKey, (err, decoded) => {
                if (err){
                    return res.status(401).send('Invalid token');}
                else {
                    req.user = decoded;
                    next();
                }
            });
        }
        else next();
    }
    static verifyResetToken(req, res, next) {
        const resetToken = JwtGenerator.getCookieFromRequest(req,'resetToken');
        if (!resetToken) return res.status(401).send('No token provided');

        jwt.verify(resetToken, secretKey, (err, decoded) => {
            if (err) return res.status(401).send('Invalid token');
            else {
                req.user = decoded;
                next();
            }
        });
    }

    static verifyRefreshToken(req, res, next) {

        const refreshToken = JwtGenerator.getCookieFromRequest(req, 'refreshToken');
        if (!refreshToken) return res.status(401).send('Unauthorized: No token provided');

        jwt.verify(refreshToken, secretKey, (err, decoded) => {
            if (err) return res.status(401).send('Unauthorized: Invalid token');
            else {
                const now = Math.floor(Date.now() / 1000);
                const isRefreshedToday = Math.floor(now / (60 * 60 * 24)) === Math.floor(decoded.iat / (60 * 60 * 24));

                if (!isRefreshedToday) {
                    const refreshToken = JwtGenerator.generateToken(decoded.id, decoded.role, '7d');
                    JwtGenerator.setRefreshTokenCookie(res, refreshToken);
                }
                req.user = decoded;
                next();
            }
        });
    }

    static getCookieFromRequest(req, cookieName){
        const { cookie } = req.headers;
        if (!cookie) return null;

        const cookies = cookie.split('; ');
        let cookieValue;

        cookies.forEach(cookie => {
            if (cookie.startsWith(`${cookieName}=`)) cookieValue = cookie.split(`${cookieName}=`)[1];
        });
        return cookieValue;
    }
    static setAccessTokenCookie(res, accessToken) {
        JwtGenerator.setCookie(res, 'accessToken', accessToken, '/');
    }
    static setRefreshTokenCookie(res, refreshToken) {
        JwtGenerator.setCookie(res, 'refreshToken', refreshToken, '/api/auth');
    }
    static calculateExpiry(duration, unit) {
        const unitsInMilliseconds = {
            "minutes": 60 * 1000,
            "hours": 60 * 60 * 1000,
            "days": 24 * 60 * 60 * 1000,
            "weeks": 7 * 24 * 60 * 60 * 1000,
        };

        if (!unitsInMilliseconds.hasOwnProperty(unit)) {
            throw new Error("Unsupported unit");
        }

        const expiresIn = Math.floor(Date.now()) + (duration * unitsInMilliseconds[unit]);
        return new Date(expiresIn);
    }

    static setCookie(res, name, value, path) {
        res.cookie(name, value, {
            httpOnly: true,
            domain: 'localhost',
            secure: true,
            maxAge: name === 'accessToken' ?
                (60 * 5 * 1000) :
                (60 * 60 * 24 * 7 * 1000),
            sameSite: 'none',
            path: path
        });
    }
}

module.exports = JwtGenerator;