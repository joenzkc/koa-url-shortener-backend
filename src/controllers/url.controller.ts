import { Repository } from "typeorm";
import { Url } from "../entities/url.entity";
import { Context } from "koa";
import { AppDataSource } from "../data-source";
import { CreateUrlDto } from "../requests/create-url.request";
import { ValidationError, validate } from "class-validator";

export default class UrlController {
  public static async getUrl(ctx: Context): Promise<void> {
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

  public static async createUrl(ctx: Context) {
    const urlRepository: Repository<Url> = AppDataSource.getRepository(Url);

    const urlToBeSaved = new Url();
    const data = <CreateUrlDto>ctx.request.body;
    urlToBeSaved.shortened_url = data.shortened_url;
    urlToBeSaved.url = data.url;

    const errors: ValidationError[] = await validate(urlToBeSaved);

    if (errors.length > 0) {
    }
  }
}
