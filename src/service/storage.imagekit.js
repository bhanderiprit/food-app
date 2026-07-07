import ImageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

async function uploadfile(fileBuffer) {
    try {
        const response = await client.files.upload({
            file: fileBuffer.toString("base64"),
            fileName: `video-${Date.now()}`,
        });
        return response;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

export default uploadfile