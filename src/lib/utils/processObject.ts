import { SwaggerDefinition } from '@/@types/swaggerDefinition'
import { checkNumberFormat } from './checkNumberFormat'

export function processObject(
  obj: any,
  integerToNumber?: boolean,
  addExamples?: boolean
): SwaggerDefinition {
  console.log(addExamples)
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
      if (addExamples) properties[key].example = obj[key]
      if (typeof obj[key] === 'number') {
        if (integerToNumber) {
          properties[key] = { type: 'number' }
        } else {
          properties[key] = { type: 'integer' }
          properties[key].format = checkNumberFormat(obj[key])
        }
      }
    }
  }
  return properties
}