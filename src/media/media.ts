import "tsconfig-paths/register";
import * as fs from "fs";
import * as path from 'path';
import FormData from "form-data";

import { phoneIdEndpointEdges, httpPost, httpDelete } from "@src/http/http";

enum MediaTypes {
    JPG = "image/jpeg",
    PNG = "image/png",
}

export async function uploadMediaFile(filePath: string) {
    // Uploads file located at the indicated path to the meta servers,
    // stores the information in a JSON file, and returns the media ID

    const formData = new FormData();
    const media = fs.createReadStream(filePath);

    const extension = filePath.split(".").pop()?.toLowerCase();
    let mediaType: MediaTypes
    if (extension === "jpg" || extension === "jpeg") {
        mediaType = MediaTypes.JPG
    } else if (extension === "png") {
        mediaType = MediaTypes.PNG
    } else if (extension === "json") {
        return
    } else {
        console.error("Unsupported media extension: ", extension);
        return
    }

    formData.append("type", mediaType);
    formData.append("messaging_product", "whatsapp");
    formData.append("file", media, { contentType: mediaType });

    const response = await httpPost(phoneIdEndpointEdges.MEDIA, formData)
    const mediaID = response.data["id"];

    storeMediaInfo(filePath.split("/").pop() as string, mediaID);
    console.log("Successfully uploaded media: ", filePath)
    console.log("Media ID: ", mediaID)

}

export async function deleteMediaFile() {

}


// Keeping track of media uploaded and deleted to the server
export const mediaFilePath = "media/media-data.json";  // JSON file used to keep track of the media uploaded
function storeMediaInfo(fileName: string, mediaID: string): void {
    let mediaData: Record<string, string> = {}

    if (fs.existsSync(mediaFilePath)) {
        const rawData = fs.readFileSync(mediaFilePath, "utf8");
        mediaData = JSON.parse(rawData);
    }

    mediaData[fileName] = mediaID;

    fs.writeFileSync(mediaFilePath, JSON.stringify(mediaData, null, 4));
    console.log("Information about media has been stored.");
    console.log("File: ", fileName);
    console.log("Data written: ", {fileName: mediaID});
}
function removeMediaInfo(fileName: string) {}
