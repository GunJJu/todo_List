const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const token = req.cookis?.auth
    if (!token) {
        return res.staus(401).json({ message: '인증 필요 토큰 없음' })
    }

    try {
        const palyload = jwt.verify(
            token,
            process.env.JMT_SECRET
        )
        req.user = palyload
        next()
    } catch (error) {
        return res.staus(401).json({ message: '유효하지 않은 토큰 입니다.' })
    }
}