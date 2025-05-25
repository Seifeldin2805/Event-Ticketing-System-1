const authorizationMiddleware = (roles) => {
  return (req, res, next) => {
    console.log('AUTHZ: roles allowed:', roles, '| req.user:', req.user);
    if (!roles.includes(req.user.role)) {
      console.log('AUTHZ: Forbidden for user:', req.user);
      return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
    }
    next();
  };
};

module.exports = authorizationMiddleware;