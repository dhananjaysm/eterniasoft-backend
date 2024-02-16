import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Enable CORS
  app.enableCors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:3000",
    ], // Specify the client origin or use '*' for allowing any origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
    credentials: true, // This is important for sending cookies and authorization headers with CORS
  });
  await app.listen(3004);
}
bootstrap();
