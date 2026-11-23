
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Du måste vara inloggad"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    req.user = {
      id: decoded.userId
    };

    next();

  } catch (error) {
    return res.status(401).json({
      error: "Ogiltig eller utgången token"
    });
  }
}

module.exports = authMiddleware;
