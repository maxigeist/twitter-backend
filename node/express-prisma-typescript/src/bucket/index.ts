import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { Constants } from '@utils'

export const s3Client = new S3Client({
  region: Constants.AWS_REGION,
  credentials: {
    accessKeyId: Constants.AWS_ACCESS_KEY_ID,
    secretAccessKey: Constants.AWS_SECRET_ACCESS_KEY
  }
})

export async function getSignedUrlAux (fileName: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: 'multipart/form-data'
  })

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

export async function deleteObject (fileName: string[]): Promise<void> {
  for (const file of fileName) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file
    })
    try {
      await s3Client.send(command)
    } catch (error) {
      console.log(error)
    }
  }
}
