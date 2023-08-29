import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PostsService } from '../posts/posts.service';
import { MediasService } from '../medias/medias.service';
import httpStatus from 'http-status';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly mediasService: MediasService,
    private readonly postsService: PostsService,
    private readonly publicationsRepository: PublicationsRepository,
  ) {}
  async create(createPublicationDto: CreatePublicationDto) {
    const date = new Date(createPublicationDto.date);
    const mediaId = createPublicationDto.mediaId;
    const postId = createPublicationDto.postId;
    const today = new Date();

    // validar date
    if (!date || date < today)
      throw new HttpException(
        'Date cant be in the past and must be a valid one!',
        HttpStatus.FORBIDDEN,
      );

    // Se não existirem registros compatíveis com o mediaId e o postId,
    // retornar o status code 404 Not Found
    if (postId) await this.postsService.findOne(postId); // throw na service
    if (mediaId) await this.mediasService.findOne(mediaId);

    return this.publicationsRepository.create(createPublicationDto);
  }

  async findAll() {
    return await this.publicationsRepository.findAll();
  }

  async findOne(id: number) {
    const publicationById = await this.publicationsRepository.findOne(id);

    // Se não houver nenhum registro compatível, retornar status code 404 Not Found
    if (!publicationById)
      throw new HttpException(
        'Publication not found! Please, search for a valid and existing publication.',
        HttpStatus.NOT_FOUND,
      );

    return publicationById;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const mediaId = updatePublicationDto.mediaId;
    const postId = updatePublicationDto.postId;

    const checkPublication = await this.publicationsRepository.findOne(id);
    if (!checkPublication)
      throw new HttpException('Publication not found!', httpStatus.NOT_FOUND);

    // Se não existirem registros compatíveis com o mediaId e o postId,
    // retornar o status code 404 Not Found
    if (postId) await this.postsService.findOne(postId); // throw na service
    if (mediaId) await this.mediasService.findOne(mediaId);

    return await this.publicationsRepository.update(id, updatePublicationDto);
  }

  async remove(id: number) {
    const publicationById = await this.publicationsRepository.findOne(id);

    // Se não houver nenhum registro compatível, retornar status code 404 Not Found
    if (!publicationById)
      throw new HttpException(
        'Publication not found! Please, search for a valid and existing publication.',
        HttpStatus.NOT_FOUND,
      );

    return await this.publicationsRepository.remove(id);
  }
}
