import Koa from "koa";
import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import Router from "koa-router";
import { AppDataSource } from "./data-source";
import UrlRouter from "./routers/url.router";
import bodyParser from "koa-bodyparser";
import RedirectRouter from "./routers/redirect.router";
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
app.use(UrlRouter.routes()).use(UrlRouter.allowedMethods());
app.use(RedirectRouter.routes()).use(RedirectRouter.allowedMethods());
AppDataSource.initialize()
  .then(() => {
    app.listen(port).on("listening", () => {
      console.log(`Listening on port ${port}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
