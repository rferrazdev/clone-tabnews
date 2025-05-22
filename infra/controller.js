import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onNoMatchHandler(req, res) {
  const publicErrorObj = new MethodNotAllowedError();
  res.status(publicErrorObj.statusCode).json(publicErrorObj);
}

function onErrorHandler(error, req, res) {
  const publicErrorObj = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.error("[next-connect] Error retrieving status:", publicErrorObj);
  res.status(publicErrorObj.statusCode).json(publicErrorObj);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
