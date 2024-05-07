// import * as AWS from 'aws-sdk'
// import * as uuid from 'uuid'
// import dotenv from 'dotenv'
// dotenv.config()
//
// const s3: AWS.S3 = new AWS.S3({ apiVersion: '2006-03-01', signatureVersion: 'v4' })
//
// export async function uploadImage (file: any): Promise<string> {
//   // console.log(file)
//   // const ex = file.split('/')[1]
//   // const fileStream = fs.createReadStream(file)
//   const key = `${uuid.v4()}.${file}`
//   const s3Params = {
//     Bucket: process.env.AWS_BUCKET_NAME as string,
//     Body: 'hello world',
//     Key: process.env.AWS_ACCESS_KEY_ID as string
//   }
//
//   const url = await s3.getSignedUrlPromise('putObject', s3Params)
//   console.log('The URL is', url)
//   return url
//   // return !!s3.getSignedUrl('putObject', s3Params)
// }

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
