export function errorHandler(error, req, res, next) {
  console.error(error.message);

  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "A resource with this value already exists.",
    });
  }

  return res.status(500).json({
    message: "Internal server error.",
  });
}
