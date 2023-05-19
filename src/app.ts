import Koa from "koa";
import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import Router from "koa-router";
import { AppDataSource } from "./data-source";
import UrlRouter from "./routers/url.router";
import bodyParser from "koa-bodyparser";
import RedirectRouter from "./routers/redirect.router";
import cors from "@koa/cors";
// const port = 4000;
require("dotenv").config();

const app: Koa<DefaultState, DefaultContext> = new Koa();
const router: Router = new Router();
app.use(bodyParser());
app.use(cors());
router.get(
  "/",
  async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
    ctx.body = { msg: "Hello World" };
  }
);

app.use(router.routes()).use(router.allowedMethods());
app.use(UrlRouter.routes()).use(UrlRouter.allowedMethods());
app.use(RedirectRouter.routes()).use(RedirectRouter.allowedMethods());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
console.log("Initializing DB...");
AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT).on("listening", () => {
      console.log(`Listening on port ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
