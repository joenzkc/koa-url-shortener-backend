import { Repository } from "typeorm";
import { Url } from "../entities/url.entity";
import { Context } from "koa";
import { AppDataSource } from "../data-source";

export default class UrlController {
  public static async getUrl(ctx: Context) {
    const urlRepository: Repository<Url> = AppDataSource.getRepository(Url);
    const url: Url | undefined = await urlRepository.findOne({
      where: { id: +ctx.params.id || 0 },
    });

    if (url) {
      ctx.status = 200;
      ctx.body = url;
    } else {
      ctx.status = 400;
      ctx.body = "URL does not exist";
    }
  }
}
