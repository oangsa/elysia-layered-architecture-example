import 'reflect-metadata';
import { Elysia } from "elysia";
import { ServiceManager } from "./Services/Core/ServiceManager";
import { CoreAdapterManager } from "./Services/CoreAdapterManager";
import { PrismaFactory } from "./Infrastructure/Database/PrismaFactory";
import { MapperProfile } from "./MapperProfile";
import { ControllerManager } from './Presentation/Controllers/Core/ControllerManager';

const app = new Elysia();

PrismaFactory.initialize();

const coreAdapterManager = new CoreAdapterManager();
const serviceManager = new ServiceManager(coreAdapterManager);
const controllerManager = new ControllerManager(serviceManager);
const mapper = coreAdapterManager.mapper;

MapperProfile.configure(mapper);

app.get("/", () => ({
  message: "Welcome to Elysia API",
  version: "1.0.0"
}));

controllerManager.RegisterRoutes(app);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
