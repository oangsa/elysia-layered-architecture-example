import { createMapper, Mapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import { MapperProfile } from '../../MapperProfile';

export class MapperInstance {
    private static _instance: Mapper;

    static get Instance(): Mapper
    {
        if (!this._instance)
        {
            this._instance = createMapper({
                strategyInitializer: classes(),
            });

            MapperProfile.configure(this._instance);
        }

        return this._instance;
    }
}
