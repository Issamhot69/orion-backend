"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,POST,PUT,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization',
    });
    await app.listen(5555);
    console.log('ORION Backend running on http://localhost:5555');
    console.log('API Key chargée:', process.env.ANTHROPIC_API_KEY ? 'OUI' : 'NON');
}
bootstrap();
//# sourceMappingURL=main.js.map