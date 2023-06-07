import { Test, TestingModule } from '@nestjs/testing';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PinController } from './pin.controller';
import { PinService } from './pin.service';
import { getMockReq, getMockRes } from '@jest-mock/express';

describe('PinController', () => {
    let pinController: PinController;
    let pinService: PinService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [NestjsFormDataModule],
            controllers: [PinController],
            providers: [PinService],
        }).compile();

        pinController = module.get<PinController>(PinController);
        pinService = module.get<PinService>(PinService);
    });

    it('should be defined', () => {
        expect(pinController).toBeDefined();
    });

    it('should return an true if user is properly authenticated', async () => {
        const { res } = getMockRes({
            data: {
                authenticated: true,
            },
        });
        const result: any = {
            data: {
                authenticated: true,
            },
        };

        jest.spyOn(pinService, 'getAuth').mockImplementation(() => result);

        expect(await pinController.getAuth(res)).toBe(res);
    });

    it('should return a set of data that includes the IpfsHash', async () => {
        const { res } = getMockRes<any>({
            data: {
                IpfsHash: 'QmbSmYhXXvzJyKcsHv1hYK2t1M7GJdgpF8yLKp7WtWrA3d',
                PinSize: 385850,
                Timestamp: '2023-06-27T22:23:12.500Z',
                isDuplicate: true,
            },
        });
        const result: any = getMockRes({
            data: {
                IpfsHash: 'QmbSmYhXXvzJyKcsHv1hYK2t1M7GJdgpF8yLKp7WtWrA3d',
                PinSize: 385850,
                Timestamp: '2023-06-27T22:23:12.500Z',
                isDuplicate: true,
            },
        });
        const req = getMockReq<any>({
            image: {
                originalName: 'bike-delivery.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                path: '/tmp/nestjs-tmp-storage/stock-photo-114331489-0c0d88.jpg',
                size: 385718,
            },
        });

        jest.spyOn(pinService, 'pinImage').mockImplementation(() => result);

        expect(await pinController.pinImage(res, req)).toBe(res);
        expect(res.data).toHaveProperty('IpfsHash');
    });
});
