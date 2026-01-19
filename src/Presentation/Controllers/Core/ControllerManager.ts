import Elysia from "elysia";
import { UserController } from "../UserController";
import { IServiceManager } from "../../../Services.Contracts/Core/IServiceManager";

export class ControllerManager
{
    private readonly userController: UserController;

    constructor(serviceManager: IServiceManager)
    {
        this.userController = new UserController(serviceManager);
    }

    public RegisterRoutes(app: Elysia): void
    {
        this.userController.RegisterRoutes(app);
    }
}
