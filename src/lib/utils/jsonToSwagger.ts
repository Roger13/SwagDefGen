import { ConvertNullToType } from '@/@types/convertNullToType'
import { SwaggerDefinition } from '@/@types/swaggerDefinition'
import { processObject } from './processObject'

export function jsonToSwagger(
  jsonData: any,
  convertNullToType: ConvertNullToType,
  addExamples: boolean,
  integerToNumber: boolean,
): string {
  const swaggerDefinition: SwaggerDefinition = {}

  for (const key in jsonData) {
    if (jsonData[key] === null) {
      swaggerDefinition[key] = {
        type: convertNullToType,
        format: 'nullable'
      }
    } else if (typeof jsonData[key] === 'object' && !Array.isArray(jsonData[key])) {
      swaggerDefinition[key] = {
        type: 'object',
        properties: processObject(jsonData[key], integerToNumber, addExamples),

      }
    } else if (Array.isArray(jsonData[key])) {
      if (jsonData[key].length > 0) {
        const firstElementType = typeof jsonData[key][0]
        if (firstElementType === 'object') {
          swaggerDefinition[key] = {
            type: 'array',
            items: {
              type: 'object',
              properties: processObject(jsonData[key][0], integerToNumber, addExamples),
            },
          }
        } else {
          swaggerDefinition[key] = {
            type: 'array',
            items: { 
              type: 'object',
              properties: processObject(jsonData[key][0], integerToNumber, addExamples)
            },
          }
        }
      } else {
        swaggerDefinition[key] = {
          type: 'array',
          items: {
            type: 'object',
            properties: processObject(jsonData[key][0], integerToNumber, addExamples)
          },
        }
      }
    } else if (typeof jsonData[key] === 'number') {
      if (integerToNumber) {
        swaggerDefinition[key] = { type: 'number' }
      } else {
        swaggerDefinition[key] = { type: 'integer' }
        
        const int32Conditional = jsonData[key] < 2147483647 && jsonData[key] > -2147483647

        if (int32Conditional) {
          swaggerDefinition[key].format = 'int32'
        } else if (Number.isSafeInteger(jsonData[key])) {
          swaggerDefinition[key].format = 'int64'
        } else {
          swaggerDefinition[key].format = 'unsafe'
        }

        if (addExamples) swaggerDefinition[key].example = jsonData[key]
      }
    } else if (typeof jsonData[key] === 'boolean') {
      swaggerDefinition[key] = { type: 'boolean' }
    } else if (typeof jsonData[key] === 'string') {
      swaggerDefinition[key] = { type: 'string' }
      if (addExamples) swaggerDefinition[key].example = jsonData[key]
    }
  }

  return JSON.stringify(swaggerDefinition)
}
