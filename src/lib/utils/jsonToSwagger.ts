interface SwaggerDefinition {
  [key: string]: {
    type: string;
    format?: string;
    properties?: SwaggerDefinition;
    items?: {
      type: string;
      properties?: SwaggerDefinition;
    };
  };
}

export function jsonToSwagger(jsonData: any, integerToNumber: boolean): string {
  const swaggerDefinition: SwaggerDefinition = {}

  function processObject(obj: any): SwaggerDefinition {
    const properties: SwaggerDefinition = {}
    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        properties[key] = {
          type: 'object',
          properties: processObject(obj[key]),
        }
      } else if (Array.isArray(obj[key])) {
        if (obj[key].length > 0) {
          const firstElementType = typeof obj[key][0]
          if (firstElementType === 'object') {
            properties[key] = {
              type: 'array',
              items: {
                type: 'object',
                properties: processObject(obj[key][0]),
              },
            }
          } else {
            properties[key] = {
              type: 'array',
              items: { type: firstElementType },
            }
          }
        } else {
          properties[key] = {
            type: 'array',
            items: { type: 'object' },
          }
        }
      } else {
        properties[key] = { type: typeof obj[key] }
        if (typeof obj[key] === 'number' && Number.isInteger(obj[key])) {
          properties[key].format = 'int32'
        }
      }
    }
    return properties
  }

  for (const key in jsonData) {
    if (jsonData[key] === null) {
      swaggerDefinition[key] = {
        type: 'boolean',
        format: 'nullable'
      }
    } else if (typeof jsonData[key] === 'object' && !Array.isArray(jsonData[key])) {
      swaggerDefinition[key] = {
        type: 'object',
        properties: processObject(jsonData[key]),
      }
    } else if (Array.isArray(jsonData[key])) {
      if (jsonData[key].length > 0) {
        const firstElementType = typeof jsonData[key][0]
        if (firstElementType === 'object') {
          swaggerDefinition[key] = {
            type: 'array',
            items: {
              type: 'object',
              properties: processObject(jsonData[key][0]),
            },
          }
        } else {
          swaggerDefinition[key] = {
            type: 'array',
            items: { 
              type: 'object',
              properties: processObject(jsonData[key][0])
            },
          }
        }
      } else {
        swaggerDefinition[key] = {
          type: 'array',
          items: {
            type: 'object',
            properties: processObject(jsonData[key][0])
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
      }
    } else if (typeof jsonData[key] === 'boolean') {
      swaggerDefinition[key] = { type: 'boolean' }
    } else if (typeof jsonData[key] === 'string') {
      swaggerDefinition[key] = { type: 'string' }
    } else {
      swaggerDefinition[key] = { type: 'boolean' }
      swaggerDefinition[key].format = 'nullable'
    }
  }

  return JSON.stringify(swaggerDefinition)
}
