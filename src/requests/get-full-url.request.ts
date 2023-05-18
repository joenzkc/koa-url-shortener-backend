import { IsDefined, IsString } from "class-validator";

export class GetFullRequestDto {
  @IsDefined()
  @IsString()
  shortened_url: string;
}
