import { IsNotEmpty, IsString } from 'class-validator';

export class ReactionDto {
  constructor(reaction: ReactionDto) {
    this.userId = reaction.userId;
    this.reactionTypeId = reaction.reactionTypeId;
    this.postId = reaction.postId;
  }

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  reactionTypeId: string;

  @IsString()
  @IsNotEmpty()
  postId: string;
}

export class ExtendedReactionDto {
  constructor(reaction: ExtendedReactionDto) {
    this.userId = reaction.userId;
    this.reactionTypeId = reaction.reactionTypeId;
    this.postId = reaction.postId;
    this.createdAt = reaction.createdAt;
    this.id = reaction.id;
  }

  userId: string;
  reactionTypeId: string;
  postId: string;
  createdAt: Date;
  id: string;
}
