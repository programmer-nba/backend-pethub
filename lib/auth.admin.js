require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = checkToken = async (req, res, next) => {
  //let token = req.headers["auth-token"];
  let token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTRjM2Q1MjU2MzUzYTU2MDc3ODRkYTYiLCJuYW1lIjoiTkJBIiwicm93IjoiYWRtaW4iLCJpYXQiOjE3MDA3MjYwMjksImV4cCI6MTcwMDc0MDQyOX0.dJdvtaSPw4OqM2Bhxv6zzf4BqhybttEr308ZiVEBY6A"
  if (token) {
    token = token.replace(/^Bearer\s+/, "");
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
      if (err) {
        return res.status(408).json({
          success: false,
          message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ admin",
          logout: true,
          description: "Request Timeout Or Admin Only",
        });
      }
      req.decoded = decoded;

      if (decoded.row !== "admin") {
        return res.status(401).json({
          success: false,
          message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
          logout: true,
          description: "Unauthorized",
        });
      }
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Token not provided Token ไม่ถูกต้อง",
      logout: false,
      description: "Unauthorized",
    });
  }
};
