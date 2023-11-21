require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = checkToken = async (req, res, next) => {
  // let token = req.headers["auth-token"];
  let token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTRjM2Q1MjU2MzUzYTU2MDc3ODRkYTYiLCJuYW1lIjoiTkJBIiwicm93IjoiYWRtaW4iLCJpYXQiOjE3MDA1NTYyMzIsImV4cCI6MTcwMDU3MDYzMn0.a65onsK1nGm2csJY42f4PK8e_RsAepFt2-EMxecgi4Y"
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
