import { Test, TestingModule } from '@nestjs/testing';
import { PinGraphqlResolver } from './pinataFile.resolver';
import { PinataService } from './pinataFile.service';
import { ConfigService } from '@nestjs/config';

import { createWriteStream, WriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';
import { mocked } from 'jest-mock';
import * as fs from 'fs/promises';

jest.mock('fs');

describe('PinGraphqlResolver', () => {
    let pinGraphqlResolver: PinGraphqlResolver;
    let pinataService: PinataService;
    let configService: ConfigService;

    fs.copyFile(
        `${process.cwd()}/test/essentials.png`,
        `${process.cwd()}/uploads/essentials.png`,
    );

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PinGraphqlResolver,
                PinataService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => {
                            if (key === 'API_KEY') {
                                return 'your-api-key';
                            } else if (key === 'API_SECRET') {
                                return 'your-api-secret';
                            }
                        }),
                    },
                },
            ],
        }).compile();

        pinGraphqlResolver = module.get<PinGraphqlResolver>(PinGraphqlResolver);
        pinataService = module.get<PinataService>(PinataService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(pinGraphqlResolver).toBeDefined();
    });

    it('should return true if the user is properly authenticated', async () => {
        const res = {
            data: {
                getAuth: {
                    authenticated: true,
                },
            },
        };
        const result: any = {
            data: {
                getAuth: {
                    authenticated: true,
                },
            },
        };

        jest.spyOn(pinataService, 'getAuth').mockImplementation(() => result);

        expect(await pinGraphqlResolver.getAuth()).toStrictEqual(res);
    });

    it('should return an IpfsHash', async () => {
        const mockWriteStream = {
            on: jest.fn().mockImplementation(function (this, event, handler) {
                if (event === 'finish') {
                    handler();
                }
                return this;
            }),
        };
        const mockReadStream = {
            pipe: jest.fn().mockReturnValueOnce(mockWriteStream),
        };

        const image: FileUpload = {
            filename: 'essentials.png',
            mimetype: 'image/png',
            encoding: '7bit',
            createReadStream: jest.fn().mockReturnValueOnce(mockReadStream),
        };

        mocked(createWriteStream).mockReturnValueOnce(
            mockWriteStream as unknown as WriteStream,
        );

        const expectedResult = {
            IpfsHash: 'QmX1Jm7radTCqZ8qdXnotjzTHJwZiqZArrqe5QjTU9Bw65',
            PinSize: 5583,
            Timestamp: '2022-01-28T21:28:14.936Z',
            isDuplicate: true,
        };

        jest.spyOn(pinataService, 'create').mockResolvedValue(expectedResult);

        expect(await pinGraphqlResolver.imageToPin(image)).toEqual(
            expectedResult,
        );
    });
});
