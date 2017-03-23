[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=102)]
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)]

# [SwagDefGen](https://roger13.github.io/SwagDefGen)
This is a tool to help building Swagger documentations. It converts JSON request/response mocks to Swagger definitions.
* Supports all swagger types
* Detects int32 and int64 formats
  * Added unsafe format to integers that use more than 64 bits
* Detects date and date-time formats according to [ISO 8601](https://xml2rfc.tools.ietf.org/public/rfc/html/rfc3339.html#anchor14)
* Allows nested objects and arrays
* Supports nullable fields
* Allows mock values to be added as example in description

## TO-DO List
* Configurable valid types/formats 
* Reflection for detecting reusable definitions
