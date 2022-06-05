import { extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";
import { resolve } from "path";

export const Memo = objectType({
    name: "Memo",
    definition(t) {
        t.nonNull.int("memoId");
        t.nonNull.string("title");
        t.nonNull.string("text");        
    },
});

export const MemoQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Memo",
            resolve(parent, args, context, info) {
                return context.prisma.memo.findMany();
            },
        });
        t.nonNull.field("feedById", {
            type: "Memo",
            args: {
                memoId: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {
                const { memoId } = args
                return context.prisma.memo.findUnique({
                    where: {
                        memoId,
                    }
                })
            },
        });
    },
});

export const MemoMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Memo",
            args: {
                title: nonNull(stringArg()),
                text: nonNull(stringArg()),
            },
            resolve(parent, args, context){
                const { title, text } = args
                const newMemo = context.prisma.memo.create({
                    data: {
                        title,
                        text,
                    }
                })                
                return newMemo;
            }
        });
        t.nonNull.field("update", {
            type: "Memo",
            args: {
                memoId: nonNull(intArg()),
                title: nullable(stringArg()),
                text: nullable(stringArg()),
            },
            resolve(parent, args, context){
                const { memoId, title, text } = args;
                const updatedUser = context.prisma.memo.update({
                    where: {
                        memoId
                    },
                    data: {
                        title,
                        text,
                    }
                })
                return updatedUser;
            }
        })
        t.nonNull.field("delete", {
            type: "Memo",
            args: {
                memoId: nonNull(intArg())
            },
            resolve(parent, args, context){
                const { memoId } = args;
                const deletedMemo = context.prisma.memo.delete({
                    where: {
                        memoId,
                    }
                })
                
                return deletedMemo
            }
        })
    }
})