export type SwaggerDefinition = {
  [key: string]: {
    type: string
    format?: string
    properties?: SwaggerDefinition
    example?: any
    items?: {
      type: string
      properties?: SwaggerDefinition
      example?: string
    };
  };
}