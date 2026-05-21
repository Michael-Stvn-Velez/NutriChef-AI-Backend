export function jsonParseErrorHandler(err, _req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      code: 400,
      success: false,
      error:
        'El cuerpo de la petición no es JSON válido. Usa Content-Type: application/json y un body como {"email":"tu@correo.com"}',
    });
  }
  next(err);
}
