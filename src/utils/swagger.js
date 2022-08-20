// const routes = require('../routes/*.js')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerOptions = {
    definition: {
        openapi:"3.0.0",
      info: {
        version: "1.0.0",
        title: "Learn Grazac API",
        description: "LearnGrazac API documentation",
        contact: {
          name: "APT3SR"
        },
        servers: [{url:"http://localhost:6900",description:'Development server'},{url:"http://prod",description:'Production server'}]
      },
    }}
    // ['.routes/*.js']
    // apis: ["./src/routes/*.js"]
//   };
  
//   const swaggerDocs = swaggerJsDoc(swaggerOptions);

  module.exports = swaggerOptions;