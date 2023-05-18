import { IsDefined, IsUrl } from "class-validator";

export class CreateUrlDto {
  @IsDefined()
  shortened_url: string;

  @IsUrl()
  @IsDefined()
  url: string;
}
