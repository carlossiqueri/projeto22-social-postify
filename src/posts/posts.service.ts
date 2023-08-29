import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  async create(createPostDto: CreatePostDto) {
    return this.postsRepository.create(createPostDto);
  }

  async findAll() {
    return this.postsRepository.findAll();
  }

  async findOne(id: number) {
    const postById = await this.postsRepository.findOne(id);

    //  Se não houver nenhum registro compatível, retornar status code 404 Not Found
    if (!postById)
      throw new HttpException(
        'Post not found! Please, search for a valid and existing post.',
        HttpStatus.NOT_FOUND,
      );

    return postById;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const postById = await this.postsRepository.findOne(id);

    //  Se não houver nenhum registro compatível, retornar status code 404 Not Found
    if (!postById)
      throw new HttpException(
        'Post not found! Please, search for a valid and existing post.',
        HttpStatus.NOT_FOUND,
      );

    return this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    // Se não houver nenhum registro compatível, retornar status code 404 Not Found
    const postById = await this.postsRepository.findOne(id);

    if (!postById)
      throw new HttpException(
        'Post not found! Please, search for a valid and existing post.',
        HttpStatus.NOT_FOUND,
      );

    // O post só pode ser deletado se não estiver fazendo parte de nenhuma publicação
    //(agendada ou publicada). Neste caso, retornar o status code 403 Forbidden.

    const checkDelete = await this.postsRepository.findExistingPublication(id);

    if (checkDelete.Publication.length > 0)
      throw new HttpException(
        'Cannot delete a post that is being used!',
        HttpStatus.FORBIDDEN,
      );

    return this.postsRepository.remove(id);
  }
}
