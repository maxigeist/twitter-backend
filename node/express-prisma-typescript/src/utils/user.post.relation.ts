import { db } from '@utils/database'
import { NotFoundException } from '@utils/errors'

//  This could be a class that takes a prisma instance
async function userFollows (currentUserId: string, authorId: string): Promise<boolean> {
  return await db.follow
    .findFirst({
      where: {
        followerId: currentUserId,
        followedId: authorId
      },
      select: {
        id: true
      }
    })
    .then((id) => !!id)
}

export async function getPostAuthorId (postId: string): Promise<string> {
  const post = await db.post.findFirst({
    where: {
      id: postId
    }
  })
  return post ? post.authorId : ''
}

async function userHasPrivateAccount (authorId: string): Promise<boolean> {
  return await db.profileVisibility
    .findFirst({
      where: {
        userId: authorId,
        type: {
          type: 'private'
        }
      }
    })
    .then((profile) => Boolean(profile))
}

export async function checkAccessToPost (userId: string, postAuthorId: string): Promise<boolean> {
  if ((await userFollows(userId, postAuthorId)) || !(await userHasPrivateAccount(postAuthorId))) {
    return true
  }
  throw new NotFoundException('post')
}
