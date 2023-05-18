import { Repository } from "typeorm";
import { Url } from "../entities/url.entity";
import {
  Context,
  DefaultContext,
  DefaultState,
  ParameterizedContext,
} from "koa";
import { AppDataSource } from "../data-source";
import { CreateUrlDto } from "../requests/create-url.request";
import { ValidationError, validate } from "class-validator";
import { CreateUrlRandomDto } from "../requests/create-url-random.request";
import crypto from "crypto";
import { GetFullRequestDto } from "../requests/get-full-url.request";

export default class UrlController {
  /**
   * Gets a URL given the id (will unlikely be used)
   * @param ctx
   */
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

  /**
   * Provided a shortened url, give the full url
   * @param ctx
   */
  public static async getFullUrl(ctx: Context): Promise<void> {
    const urlRepository: Repository<Url> = AppDataSource.getRepository(Url);
    const data: GetFullRequestDto = <GetFullRequestDto>ctx.request.body;
    const validatedData = new GetFullRequestDto();
    validatedData.shortened_url = data.shortened_url;
    const errors: ValidationError[] = await validate(validatedData);
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }
    const url: Url = await urlRepository.findOne({
      where: { shortened_url: data.shortened_url },
    });
    if (url) {
      ctx.status = 200;
      ctx.body = url;
    } else {
      ctx.status = 400;
      ctx.body = "URL does not exist";
    }
  }

  /**
   * Creates a shortened URL based on the request
   * @param ctx
   */
  public static async createUrl(ctx: Context): Promise<void> {
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
  public static async createUrlRandom(ctx: Context): Promise<void> {
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

  public static async redirectUrl(
    ctx: ParameterizedContext<DefaultState, DefaultContext>
  ) {
    const urlRepository: Repository<Url> = AppDataSource.getRepository(Url);
    const shortened_url = ctx.params.shortened_url;

    const url = await urlRepository.findOne({ where: { shortened_url } });
    if (!url) {
      ctx.status = 400;
      ctx.body = "Unable to find URL to redirect to!";
    } else {
      ctx.status = 200;
      ctx.body = url;
    }
  }
}
