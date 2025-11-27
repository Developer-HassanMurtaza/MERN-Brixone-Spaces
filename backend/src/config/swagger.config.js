import swaggerJSDoc from "swagger-jsdoc";

const rawSwaggerUrls = process.env.SWAGGER_URLS || "";
const envServers = rawSwaggerUrls
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((baseUrl) => {
    const normalizedBase = baseUrl.replace(/\/+$/, "");
    const urlWithApi = /\/api\/?$/.test(normalizedBase)
      ? normalizedBase
      : `${normalizedBase}/api`;
    const description = /localhost|127\.0\.0\.1/i.test(urlWithApi)
      ? "Local"
      : "Remote";
    return { url: urlWithApi, description };
  });

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: process.env.SWAGGER_TITLE || "Brixone Spaces API",
    version: process.env.SWAGGER_VERSION || "1.0.0",
    description:
      process.env.SWAGGER_DESCRIPTION ||
      "API documentation for the Brixone Spaces service.",
  },
  servers:
    envServers.length > 0
      ? envServers
      : [{ url: "/api", description: "API base path" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec };
