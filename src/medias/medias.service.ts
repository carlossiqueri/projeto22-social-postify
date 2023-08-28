import { Injectable } from '@nestjs/common';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {

    constructor(private readonly repository: MediasRepository) {
        
    }
}
