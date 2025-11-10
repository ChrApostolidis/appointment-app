"use server";

import { getCurrentUser } from "@/auth/currentUser";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import crypto from "crypto";
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const acceptedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const maxFileSize = 5 * 1024 * 1024; // 5MB

export async function getSignedURL(
  fileType: string,
  fileSize: number,
  checksum: string
) {
  const currentUser = await getCurrentUser({ withFullUser: true });

  if (!currentUser) {
    return { failure: "Not Authenticated" };
  }

  if (!acceptedFileTypes.includes(fileType)) {
    return { failure: "Invalid file type" };
  }

  if (fileSize > maxFileSize) {
    return { failure: "File size exceeds maximum limit" };
  }

  const key = generateFileName();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: currentUser.id,
    },
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  // Construct the full URL for storing in DB
  const logoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { success: { url: signedURL, key: key, logoUrl: logoUrl } };
}
