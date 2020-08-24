import { Entry } from "./entities/Entry";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";
import { __prod__ } from "./constants";
import path from "path";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[jt]s$/,
    },
    entities: [Entry, User],
    dbName: "tierlist",
    type: "postgresql",
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
