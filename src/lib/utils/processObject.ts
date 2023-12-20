import { SwaggerDefinition } from '@/@types/swaggerDefinition'

export function processObject(
  obj: any,
  integerToNumber?: boolean,
  addExamples?: boolean
): SwaggerDefinition {
  
  const properties: SwaggerDefinition = {}
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      properties[key] = {
        type: 'object',
        properties: processObject(obj[key])
      }
    } else if (Array.isArray(obj[key])) {
      if (obj[key].length > 0) {
        const firstElementType = typeof obj[key][0]
        if (firstElementType === 'object') {
          properties[key] = {
            type: 'array',
            items: {
              type: 'object',
              properties: processObject(obj[key][0])
            },
          }
        } else {
          properties[key] = {
            type: 'array',
            items: { type: firstElementType }
          }
        }
      } else {
        properties[key] = {
          type: 'array',
          items: { type: 'object' }
        }
      }
    } else {
      properties[key] = { type: typeof obj[key] }
      if (typeof obj[key] === 'number') {
        if (integerToNumber) {
          properties[key] = { type: typeof obj[key] }
        } else {
          properties[key] = { type: 'integer' }

          if (obj[key] < 2147483647 && obj[key] > -2147483647) {
            properties[key].format = 'int32'
          } else if (Number.isSafeInteger(obj[key])) {
            properties[key].format = 'int64'
          } else {
            properties[key].format = 'unsafe'
          }
        }
      }
    }
  }
  return properties
}