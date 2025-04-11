import { Client, Storage } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("67f8e5020020502a85c0");

const storage = new Storage(client);

export { client, storage };