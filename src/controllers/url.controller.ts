import { Repository } from "typeorm";
import { Url } from "../entities/url.entity";
import { Context } from "koa";
import { AppDataSource } from "../data-source";
import { CreateUrlDto } from "../requests/create-url.request";
import { ValidationError, validate } from "class-validator";
import { CreateUrlRandomDto } from "../requests/create-url-random.request";
import crypto from "crypto";

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

    const urlToBeSaved = new CreateUrlDto();
    const data = <CreateUrlDto>ctx.request.body;
    urlToBeSaved.shortened_url = data.shortened_url;
    urlToBeSaved.url = data.url;

    const errors: ValidationError[] = await validate(urlToBeSaved);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (
      await urlRepository.findOne({
        where: { shortened_url: data.shortened_url },
      })
    ) {
      ctx.status = 400;
      ctx.body = "URL already exists, please use another URL";
    } else {
      const url = await urlRepository.save(urlToBeSaved);
      ctx.status = 201;
      ctx.body = url;
    }
  }

  /**
   * Creates a shortened URL with a random URL
   * @param ctx
   */
  public static async createUrlRandom(ctx: Context) {
    const urlRepository: Repository<Url> = AppDataSource.getRepository(Url);
    const data = <CreateUrlRandomDto>ctx.request.body;

    const urlToBeSaved = new CreateUrlRandomDto();
    urlToBeSaved.url = data.url;
    const errors: ValidationError[] = await validate(urlToBeSaved);
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else {
      while (true) {
        const randomGeneratedUrl = crypto.randomBytes(3).toString("hex");
        if (
          await urlRepository.findOne({
            where: { shortened_url: randomGeneratedUrl },
          })
        ) {
          continue;
        }
        let url: Url = new Url();
        url.url = data.url;
        url.shortened_url = randomGeneratedUrl;
        url = await urlRepository.save(url);
        ctx.status = 200;
        ctx.body = url;
        return;
      }
    }
  }
}
