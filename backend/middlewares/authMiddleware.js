const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(403).json({
        message: "No token provided."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Token verification failed."
      });
    }

    //{roles : admin, customer, rider}
    // adding user info to req object 
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

//additional check accr to our requirement,
function requireRole(roles = []) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    };
  }


  
module.exports = {requireRole, authMiddleware};
