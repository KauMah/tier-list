import { Query, Resolver, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from "../types";
import { Entry } from "../entities/Entry";

@Resolver()
export class EntryResolver {
    @Query(() => [Entry])
    entries(@Ctx() { em }: MyContext): Promise<Entry[]> {
        return em.find(Entry, {});
    }
    @Query(() => Entry, { nullable: true })
    entry(
        @Arg("id", () => Int) id: number,
        @Ctx() { em }: MyContext
    ): Promise<Entry | null> {
        return em.findOne(Entry, { id });
    }

    @Mutation(() => Entry)
    async createEntry(
        @Arg("title", () => String) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Entry | null> {
        const entry = em.create(Entry, { title });
        await em.persistAndFlush(entry);
        return entry;
    }

    @Mutation(() => Entry)
    async updateEntry(
        @Arg("id", () => Int) id: number,
        @Arg("title", () => String, { nullable: true }) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Entry | null> {
        const entry = await em.findOne(Entry, { id });

        if (!entry) {
            return null;
        }
        if (typeof title !== undefined) {
            entry.title = title;
            await em.persistAndFlush(entry);
        }
        return entry;
    }

    @Mutation(() => Boolean)
    async deleteEntry(
        @Arg("id", () => Int) id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        await em.nativeDelete(Entry, { id });
        return true;
    }
}
