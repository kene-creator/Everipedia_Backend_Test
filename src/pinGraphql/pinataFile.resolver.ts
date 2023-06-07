import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PinGraphql } from './models/pinGraphql';
import { PinataService } from './pinataFile.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import * as fs from 'fs/promises';

@Resolver(() => PinGraphql)
export class PinGraphqlResolver {
    constructor(private readonly pinataService: PinataService) {}

    @Query(() => PinGraphql)
    async getAuth(): Promise<any> {
        return await this.pinataService.getAuth();
    }

    @Mutation(() => PinGraphql, { name: 'imageToPin' })
    async imageToPin(
        @Args({ name: 'image', type: () => GraphQLUpload })
        image: FileUpload,
    ): Promise<FileUpload> {
        const { createReadStream, filename } = image;
        const destinationPath = `./uploads/${filename}`;
        return await new Promise((res, rej) =>
            createReadStream()
                .pipe(createWriteStream(destinationPath))
                .on('error', rej)
                .on('finish', async () => {
                    const result = await this.pinataService.create(
                        destinationPath,
                    );
                    await fs.unlink(destinationPath);
                    res(result);
                }),
        );
    }
}
