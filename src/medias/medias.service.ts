import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly mediasRepository: MediasRepository) {}

  async create(createMediaDto: CreateMediaDto) {
    const title = createMediaDto.title;
    const username = createMediaDto.username;

    // Impeça a criação de um novo registro com a mesma combinação de title
    //e username (caso exista, retornar status code 409 Conflict).
    const checkExistingMedia = await this.mediasRepository.findExistingMedia(
      title,
      username,
    );

    if (checkExistingMedia)
      throw new HttpException(
        'This media already exists!',
        HttpStatus.CONFLICT,
      );

    return this.mediasRepository.create(createMediaDto);
  }

  async findAll() {
    return this.mediasRepository.findAll();
  }

  async findOne(id: number) {
    const mediaById = await this.mediasRepository.findOne(id);

    //  Se não houver nenhum registro compatível, retornar status code 404 Not Found
    if (!mediaById)
      throw new HttpException(
        'Media not found! Please, search for a valid and existing media.',
        HttpStatus.NOT_FOUND,
      );

    return mediaById;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    // Se não houver nenhum registro compatível, retornar status code 404 Not Found
    const mediaById = await this.mediasRepository.findOne(id);

    if (!mediaById)
      throw new HttpException(
        'Media not found! Please, search for a valid and existing media.',
        HttpStatus.NOT_FOUND,
      );

    //A mudança não pode violar a regra de `title` e `username` únicos.
    //Se isso acontecer, retorne o status code `409 Conflict`.
    const title = updateMediaDto.title;
    const username = updateMediaDto.username;

    const checkExistingMedia = await this.mediasRepository.findExistingMedia(
      title,
      username,
    );

    if (checkExistingMedia)
      throw new HttpException(
        'This media already exists!',
        HttpStatus.CONFLICT,
      );

    return this.mediasRepository.update(id, updateMediaDto);
  }

  async remove(id: number) {
    // Se não houver nenhum registro compatível, retornar status code 404 Not Found
    const mediaById = await this.mediasRepository.findOne(id);

    if (!mediaById)
      throw new HttpException(
        'Media not found! Please, search for a valid and existing media.',
        HttpStatus.NOT_FOUND,
      );

    // A media só pode ser deletada se não estiver fazendo parte de nenhuma publicação
    //(agendada ou publicada). Neste caso, retornar o status code 403 Forbidden.

    const checkDelete = await this.mediasRepository.findExistingPublication(id);
    // Dependencias ciclicas: Abordagem 2: Faça uso da API do Prisma
    // As vezes uma query com JOIN já traz a informação que você precisa sem a necessidade 
    // de usar outros services ou repositórios. Valide se não é o caso.
    if(checkDelete.Publication.length > 0) throw new HttpException('Cannot delete a media that is being used!', HttpStatus.FORBIDDEN);

    return this.mediasRepository.remove(id);
  }
}
