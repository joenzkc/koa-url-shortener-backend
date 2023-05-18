import {
  Context,
  DefaultContext,
  DefaultState,
  ParameterizedContext,
} from "koa";
import Router from "koa-router";
import { url } from "../controllers";

const RedirectRouter = new Router();

RedirectRouter.get("/:shortened_url", url.redirectUrl);

export default RedirectRouter;
