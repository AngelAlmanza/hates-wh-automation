# ADR-001: Estandarización de Respuestas de API

## Estado

Aceptado — 2026-03-31

## Contexto

La API retornaba respuestas en formatos inconsistentes: los controladores devolvían datos crudos de Prisma sin envelope, los errores variaban en forma dependiendo del tipo de excepción. Esto complicaba el manejo de respuestas en el frontend, donde cada endpoint requería lógica de parsing diferente.

Se necesitaba un contrato predecible para que tanto respuestas exitosas como errores siguieran una estructura uniforme.

## Decisión

Estandarizar todas las respuestas de la API usando un envelope consistente, implementado mediante un **interceptor global** para respuestas exitosas y un **exception filter global** para errores.

### Respuesta exitosa

Todas las respuestas con status 2xx (excepto 204) se envuelven automáticamente:

```json
{
  "data": <T>,
  "message": "Operación exitosa",
  "statusCode": 200
}
```

- `data` contiene el payload (objeto, array, o `null`)
- `message` por defecto es `"Operación exitosa"`, personalizable con el decorador `@ResponseMessage()`
- `statusCode` refleja el código HTTP real (200, 201, etc.)

### Respuesta 204 No Content

Sin body. Se mantiene el comportamiento estándar HTTP para operaciones DELETE.

### Respuesta de error

```json
{
  "message": "Categoría con id X no encontrada",
  "error": "Not Found",
  "statusCode": 404
}
```

### Error de validación

```json
{
  "message": "Error de validación",
  "error": "Bad Request",
  "statusCode": 400,
  "errors": [
    "name must be a string",
    "name should not be empty"
  ]
}
```

- `errors` es un array presente únicamente en errores de validación (class-validator)

### Error interno

```json
{
  "message": "Error interno del servidor",
  "error": "Internal Server Error",
  "statusCode": 500
}
```

Excepciones no controladas se loggean con stack trace pero nunca se exponen al cliente.

## Implementación

| Componente | Ubicación |
|---|---|
| TransformInterceptor | `apps/api/src/common/interceptors/transform.interceptor.ts` |
| GlobalExceptionFilter | `apps/api/src/common/filters/http-exception.filter.ts` |
| ResponseMessage decorator | `apps/api/src/common/decorators/response-message.decorator.ts` |
| Tipos compartidos | `packages/shared/src/api/api-response.types.ts` |

- El interceptor se registra globalmente en `main.ts`
- Los controllers no necesitan cambiar sus retornos; el envelope se aplica automáticamente
- Los services siguen lanzando excepciones HTTP de NestJS (`NotFoundException`, `ConflictException`, etc.)
- El frontend usa un interceptor de Axios en `apiClient` para extraer `response.data.data` automáticamente

## Consecuencias

### Positivas

- El frontend puede confiar en una estructura predecible para todas las respuestas
- Los errores de validación incluyen detalle granular en el campo `errors`
- Los controllers se mantienen limpios — sin lógica de wrapping manual
- Todos los mensajes de error están en español, consistente con el sistema

### Negativas

- Respuestas ligeramente más grandes por el overhead del envelope
- Swagger no refleja el envelope automáticamente (los tipos documentados corresponden al contenido de `data`)
- `auth.ts` en el frontend usa `axios` directamente y requiere unwrap manual
