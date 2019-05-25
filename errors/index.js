exports.routeNotFound = (req, res, next) => {
  res.status(404).send({
    msg: 'Route Not Found'
  });
};

exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({
    msg: 'Method Not Allowed'
  });
};

exports.handle400 = (err, req, res, next) => {
  // console.log(err)
  const codes = {
    '42703': 'Bad Query',
    400: 'Bad Request',
    '22P02': 'Bad Request',


  }
  if (codes[err.code]) res.status(400).send({
    msg: codes[err.code]
  })
  else next(err);
}

exports.handle404 = (err, req, res, next) => {
  const codes = {
    '23502': 'Not Found',
    '23503': 'Not Found',
    404: 'Not Found'
  }
  if (codes[err.code]) res.status(404).send({
    msg: codes[err.code]
  })
  else next(err)
}

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({
    msg: 'Internal Server Error'
  });
};