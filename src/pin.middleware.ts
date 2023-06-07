import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bodyParser from 'body-parser';

@Injectable()
export class PinMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        bodyParser.json({ limit: '50mb' })(req, res, next);
    }
}
