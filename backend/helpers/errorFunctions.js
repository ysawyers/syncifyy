// returns status code 400 BAD REQUEST
function httpError400(res, errorMessage) {
  const error = new Error(errorMessage);
  res.status(400);
  res.json(error.message);
}

// returns status code 500 INTERNAL SERVER ERROR
function httpError500(res, errorMessage) {
  const error = new Error(errorMessage);
  res.status(500);
  res.json(error.message);
}

// returns status code 409 CONFLICT
function httpError409(res, errorMessage) {
  const error = new Error(errorMessage);
  res.status(409);
  res.json(error.message);
}

module.exports = {
  httpError400,
  httpError500,
  httpError409,
};
