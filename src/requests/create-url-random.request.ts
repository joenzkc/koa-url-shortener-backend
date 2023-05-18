import { IsDefined, IsUrl } from "class-validator";

export class CreateUrlRandomDto {
  @IsDefined()
  @IsUrl()
  url: string;
}
