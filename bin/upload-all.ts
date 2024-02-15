import * as fs from 'fs';
import * as path from 'path';

import 'tsconfig-paths/register';
import { uploadMediaFile } from '@src/media/media';



console.log("Starting batch upload of all media files...");

function getFileNames(directoryPath: string): string[] {
    try {
        const files = fs.readdirSync(directoryPath);
        return files.map((file) => path.join(directoryPath, file));
    } catch (error) {
        console.error("Error reading directory: ", error);
        return [];
    }
}

const mediaDir = "media/";
const files = getFileNames(mediaDir);
console.log("Found the following files in the folder:  ", files);
for (const file of files) {
    uploadMediaFile(file)

}

