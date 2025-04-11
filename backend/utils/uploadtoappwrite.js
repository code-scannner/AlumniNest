import { storage } from "./appwrite.js";
import { ID } from "node-appwrite";
import fs from "fs/promises";

export async function upload(localPath) {
    uploadedFile = await storage.createFile(
        "67f8e53c0001a80cdbde",
        ID.unique(),
        await fs.readFile(localPath)
    );

    try {
        await fs.unlink(localPath);
    } catch (err) {
        console.error("Failed to delete local file:", err);
    }

    return uploadedFile;
}