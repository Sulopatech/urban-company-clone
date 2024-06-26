import {
    DeepPartial,
    VendureEntity
} from '@vendure/core';
import { Column, Entity } from 'typeorm';


@Entity()
export class CustomoreProfilePicture extends VendureEntity {
    constructor(input?: DeepPartial<CustomoreProfilePicture>) {
        super(input);
    }

    @Column()
    code: string;
}
