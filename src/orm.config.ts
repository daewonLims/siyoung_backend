import { TypeOrmModuleOptions } from "@nestjs/typeorm";

function ormConfig(): TypeOrmModuleOptions {
    const commoConf = {
        SYNCRONIZE : false,
        ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
        MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
        CLI: {
            migrationsDir: 'src/migrations',
        },
        MIGRATIONS_RUN: false,
    };

    const ormconfig: TypeOrmModuleOptions = {
        name: 'default',
        type: 'mysql',
        host: 'localhost',
        port: 13306,
        username: 'root',
        password: 'root',
        database: 'test',
        logging: true,//쿼리문 로그에 찍도록 도와주는 옵션
        entities: commoConf.ENTITIES,
        synchronize: commoConf.SYNCRONIZE,
        migrations: commoConf.MIGRATIONS,
        cli: commoConf.CLI,
        migrationsRun: commoConf.MIGRATIONS_RUN,
    }

    return ormconfig;
}

export { ormConfig };