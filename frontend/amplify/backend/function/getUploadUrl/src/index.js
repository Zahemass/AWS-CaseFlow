import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.REGION || "us-east-1" });
const BUCKET = process.env.STORAGE_CASEFLOWDOCS_BUCKETNAME;

export const handler = async (event) => {
  try {
    console.log("Incoming event:", event);

    const body = event.body ? JSON.parse(event.body) : {};
    const { fileName = "document.pdf", caseId = "default" } = body;

    const key = `cases/${caseId}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: "application/pdf",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 minutes

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        uploadUrl,
        key,
        bucket: BUCKET,
      }),
    };
  } catch (err) {
    console.error("Error generating upload URL:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate upload URL" }),
    };
  }
};
