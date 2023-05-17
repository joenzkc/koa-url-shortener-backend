import { DefaultContext, DefaultState, ParameterizedContext } from "koa";
import Router from "koa-router";

const routesRouter = new Router({ prefix: "/user" });

routesRouter.get(
  "/",
  async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
    ctx.body = { msg: "Hello User" };
  }
);

export default routesRouter;
