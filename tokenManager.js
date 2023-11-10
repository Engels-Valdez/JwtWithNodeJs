const strategyToken = (req, resp, next) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    resp.sendStatus(403);
    return;
  }

  const token = bearerHeader.split(" ")[1];
  req.token = token;
  next();
};

const verifyToken = (req, jwt, privateKey)=> {
  try {
    const auth = jwt.verify(req.token, privateKey);
    return auth
  } catch (error) {
    return;
  }

}

module.exports = {strategyToken, verifyToken};

