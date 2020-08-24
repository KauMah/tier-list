import {
    Resolver,
    Arg,
    Mutation,
    InputType,
    Field,
    Ctx,
    ObjectType,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
@InputType()
class RegisterInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => FieldError, { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: RegisterInput,
        @Ctx() { em }: MyContext
    ) {
        if (options.username.length <= 6) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Username must be at least 6 characters",
                    },
                ],
            };
        }
        if (options.password) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Invalid password",
                    },
                ],
            };
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
        });
        await em.persistAndFlush(user);
        return user;
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: RegisterInput,
        @Ctx() { em }: MyContext
    ) {
        const user = await em.findOne(User, { username: options.username });

        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Invalid username",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, options.password);

        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Invalid password",
                    },
                ],
            };
        }

        return user;
    }
}
