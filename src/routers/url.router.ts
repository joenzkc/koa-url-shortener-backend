import Router from "koa-router";
import { url } from "../controllers";

const UrlRouter = new Router({ prefix: "/url" });

UrlRouter.get("/", url.getUrl);

export default UrlRouter;
