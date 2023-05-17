import Koa from "koa";
import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import Router from "koa-router";
import { AppDataSource } from "./data-source";
import routesRouter from "./routes";
import UrlRouter from "./routers/url.router";
import bodyParser from "koa-bodyparser";
const port = 4000;

const app: Koa<DefaultState, DefaultContext> = new Koa();
const router: Router = new Router();
app.use(bodyParser());
router.get(
  "/",
  async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
    ctx.body = { msg: "Hello World" };
  }
);

app.use(router.routes()).use(router.allowedMethods());
app.use(routesRouter.routes());
app.use(routesRouter.allowedMethods());
app.use(UrlRouter.routes()).use(UrlRouter.allowedMethods());

AppDataSource.initialize()
  .then(() => {
    console.log("init");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port).on("listening", () => {
  console.log(`Listening on port ${port}...`);
});
