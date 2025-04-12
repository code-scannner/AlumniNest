import { storage } from "./appwrite.js";
import { ID } from "node-appwrite";
import fs from "fs/promises";
import { InputFile } from "node-appwrite/file";

export async function upload(localPath) {
  const uploadedFile = await storage.createFile(
    "67f8e53c0001a80cdbde",
    ID.unique(),
    InputFile.fromPath(localPath, `${Date.now()}.jpg`)
  );
  const link = `https://cloud.appwrite.io/v1/storage/buckets/67f8e53c0001a80cdbde/files/${uploadedFile.$id}/view?project=67f8e5020020502a85c0&mode=admin`;
  try {
    await fs.unlink(localPath);
  } catch (err) {
    console.error("Failed to delete local file:", err);
  }

  return link;
}

export async function deleteFile(filepath) {
  const fileId = filepath.substr(73).split('/')[0]
  try {
    await storage.deleteFile("67f8e53c0001a80cdbde", fileId);
  } catch (err) {
    console.error("Failed to delete file:", err);
  }
}
