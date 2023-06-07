/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

const pinataSDK = require('@pinata/sdk');

@Injectable()
export class PinataService {
    private readonly pinata: typeof pinataSDK;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('API_KEY');
        const apiSecret = this.configService.get<string>('API_SECRET');
        this.pinata = pinataSDK(apiKey, apiSecret);
    }

    async getAuth(): Promise<any> {
        try {
            const res = await this.pinata.testAuthentication();
            return res;
        } catch (e) {
            throw new Error('Failed to authenticate with Pinata');
        }
    }

    async create(file: fs.PathLike): Promise<any> {
        const readableStreamForFile = fs.createReadStream(file);
        try {
            const res = await this.pinata.pinFileToIPFS(readableStreamForFile);
            return res;
        } catch (e) {
            throw new Error('Failed to pin file to IPFS');
        }
    }
}
