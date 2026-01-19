import 'reflect-metadata';
import { Elysia } from "elysia";
import { UserController } from "./Presentation/Controllers/UserController";
import { ServiceManager } from "./Services/Core/ServiceManager";
import { CoreAdapterManager } from "./Services/CoreAdapterManager";
import { PrismaFactory } from "./Infrastructure/Database/PrismaFactory";

const app = new Elysia();

// Initialize Prisma Database Connection (like .NET Program.cs)
PrismaFactory.initialize();

// Initialize dependencies (Dependency Injection)
const coreAdapterManager = new CoreAdapterManager();
const serviceManager = new ServiceManager(coreAdapterManager);

app.get("/", () => ({
  message: "Welcome to Elysia API",
  version: "1.0.0"
}));

// Register User Controller with DI
const userController = new UserController(serviceManager);
userController.RegisterRoutes(app);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
