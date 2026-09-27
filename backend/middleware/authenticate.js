import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const accessToken = authorization.split(" ")[1];

  try {
    const payload = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = {
      id: payload.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token.",
    });
  }
}
