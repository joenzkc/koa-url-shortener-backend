import Router from "koa-router";
import { url } from "../controllers";

const UrlRouter = new Router({ prefix: "/url" });

UrlRouter.get("/", url.getUrl);
UrlRouter.get("/full", url.getFullUrl);
UrlRouter.post("/", url.createUrl);
UrlRouter.post("/random", url.createUrlRandom);

export default UrlRouter;
