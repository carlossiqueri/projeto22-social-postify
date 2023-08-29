import { IsDateString, IsInt } from "class-validator";

export class CreatePublicationDto {
    @IsInt()
    mediaId: number;

    @IsInt()
    postId: number;

    @IsDateString()
    date: string;
}
