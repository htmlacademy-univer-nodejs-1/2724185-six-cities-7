import type {CreateCommentDto} from './dto/create-comment.dto.js';
import type {CommentDocument} from './comment.model.js';

export interface CommentService {
  findByOfferId(offerId: string): Promise<CommentDocument[]>;
  create(data: CreateCommentDto): Promise<CommentDocument>;
}
