/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, UploadedFile } from '@nestjs/common';

const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

const pinata = pinataSDK(process.env.API_KEY, process.env.API_SECRET);

@Injectable()
export class PinService {
    static test: any;
    async getAuth(): Promise<any> {
        try {
            const res = await pinata.testAuthentication();
            return res;
        } catch (e) {
            return e;
        }
    }

    async pinImage(@UploadedFile() file: string): Promise<any> {
        const readableStreamForFile = fs.createReadStream(file);
        try {
            const res = await pinata.pinFileToIPFS(readableStreamForFile);
            return res;
        } catch (e) {
            return e;
        }
    }
}
