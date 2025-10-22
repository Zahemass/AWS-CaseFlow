// src/services/documents/uploadService.js
// ✅ Updated version with in-browser PDF extraction + correct S3 key handling + single /documents POST

import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';
import { S3_CONFIG } from '@/config/aws.config';
import apiClient from '@/services/api/apiClient';
import { ENDPOINTS } from '@/services/api/endpoints';
import { extractPdfTextInBrowser } from './pdfExtract.browser'; // 👈 helper for PDF text extraction

// ---------------------------
// 🔹 Helper: generate a unique documentId
// ---------------------------
function makeId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ---------------------------
// 🔹 Check AWS Amplify connection (debug helper)
// ---------------------------
export const checkAWSConnection = async () => {
  try {
    console.log('🟡 Checking AWS Amplify connection...');
    console.log('S3 bucket (env):', import.meta.env.VITE_AWS_S3_BUCKET);
    console.log('S3 config bucket:', S3_CONFIG.bucket);
    console.log('S3 region:', S3_CONFIG.region);

    const session = await fetchAuthSession();
    const creds = session.credentials;

    if (creds?.accessKeyId) {
      console.log('✅ AWS Connected: Credentials loaded successfully.');
      console.log('🔑 AccessKeyId:', creds.accessKeyId.slice(0, 8) + '...');
      console.log('👤 IdentityId:', session.identityId);
      console.log('🌎 Region:', S3_CONFIG.region);
    } else {
      console.warn('⚠️ AWS credentials not found. Possibly not signed in yet.');
    }
  } catch (err) {
    console.error('❌ AWS connection check failed:', err);
  }
};

// ---------------------------
// 🔹 Main Upload Function
// ---------------------------
export const uploadFile = async (file, keyPrefix = 'uploads/', caseId = 'GENERAL') => {
  try {
    await checkAWSConnection();

    // STEP 1️⃣ → Generate unique documentId
    const documentId = makeId();
    console.log('🆔 Generated documentId:', documentId);

    // STEP 2️⃣ → Extract PDF text (if applicable)
    let extractedText = '';
    let pagesCount = 0;

    if (file.type === 'application/pdf') {
      console.log('📘 Extracting text from PDF before upload...');
      try {
        const { text, pages } = await extractPdfTextInBrowser(file);
        extractedText = text;
        pagesCount = pages;
        console.log(`✅ Extracted ${text.length} chars from ${pages} pages.`);
      } catch (extractErr) {
        console.warn('⚠️ PDF extraction failed:', extractErr);
      }
    } else {
      console.log(`ℹ️ Skipping text extraction (file type: ${file.type})`);
    }

    // STEP 3️⃣ → Upload file to S3
    const amplifyKey = `${keyPrefix}${Date.now()}-${file.name}`;
    console.log(`📤 Uploading to S3 → bucket: ${S3_CONFIG.bucket}, key: ${amplifyKey}`);

    const result = await uploadData({
      key: amplifyKey,
      data: file,
      options: {
        contentType: file.type,
        progressCallback(progress) {
          const percent = Math.round((progress.transferredBytes / progress.totalBytes) * 100);
          console.log(`📶 Upload progress: ${percent}%`);
        },
      },
    }).result;

    console.log('✅ S3 upload successful:', result);

    // 🟢 FIX — Amplify already stores under "public/"
    const actualS3Key = amplifyKey;
    console.log(`📍 Actual stored S3 key: ${actualS3Key}`);

    // STEP 4️⃣ → Notify backend (/documents)
    const payload = {
      documentId,
      title: file.name,
      s3Key: actualS3Key, // ✅ No manual "public/" prefix
      caseId,
      extractedText,
      pagesCount,
    };

    console.log('📨 Sending to backend /documents:', payload);
    const response = await apiClient.post(ENDPOINTS.DOCUMENTS.BASE, payload);
    console.log('🪣 Saved in DynamoDB (documents + extracted):', response.data);

    return {
      documentId,
      key: actualS3Key,
      amplifyKey,
      caseId,
      ...result,
    };
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

// ---------------------------
// 🔹 Get signed file URL
// ---------------------------
export const getFileUrl = async (key) => {
  try {
    // Amplify adds "public/" automatically, so we strip it when generating URL
    const amplifyKey = key.startsWith('public/') ? key.substring(7) : key;
    console.log(`🔗 Fetching signed URL for: ${amplifyKey}`);

    const { url } = await getUrl({
      key: amplifyKey,
      options: { bucket: S3_CONFIG.bucket, expiresIn: 3600 },
    });

    console.log('✅ Signed URL generated:', url);
    return url;
  } catch (error) {
    console.error('❌ Failed to fetch file URL:', error);
    throw error;
  }
};

// ---------------------------
// 🔹 Delete file from S3
// ---------------------------
export const deleteFile = async (key) => {
  try {
    // Same logic: remove "public/" prefix if exists
    const amplifyKey = key.startsWith('public/') ? key.substring(7) : key;
    console.log(`🗑️ Deleting file from bucket: ${S3_CONFIG.bucket}`);

    await remove({
      key: amplifyKey,
      options: { bucket: S3_CONFIG.bucket },
    });

    console.log('✅ File deleted successfully:', key);
  } catch (error) {
    console.error('❌ File deletion failed:', error);
    throw error;
  }
};

// ---------------------------
// 🔹 Backward compatibility alias
// ---------------------------
export const uploadToS3 = uploadFile;
