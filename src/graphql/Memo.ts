import { extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";

export const Memo = objectType({
    name: "Memo",
    definition(t) {
        t.nonNull.int("memoId");
        t.nonNull.string("title");
        t.nonNull.string("content");
        t.field("postedBy", {
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.memo
                    .findUnique({
                        where: {
                            memoId: parent.memoId
                        }
                    })
                    .postedBy();
            }
        })      
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
        
        t.field("feedById", {
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
                content: nonNull(stringArg()),
            },
            resolve(parent, args, context){
                const { title, content } = args;
                const { userId } = context;

                if (!userId) {
                    throw new Error("You need to login first")
                }

                const newMemo = context.prisma.memo.create({
                    data: {
                        title,
                        content,
                        postedBy: { connect: { id: userId } },
                    },
                });

                return newMemo;
            }
        });
        t.nonNull.field("update", {
            type: "Memo",
            args: {
                memoId: nonNull(intArg()),
                title: nonNull(stringArg()),
                content: nonNull(stringArg()),
            },
            resolve(parent, args, context){
                const { memoId, title, content } = args;
                const { userId } = context;

                if (!userId) {
                    throw new Error("You need to login first")
                }
                const updatedUser = context.prisma.memo.update({
                    where: {
                        memoId
                    },
                    data: {
                        title,
                        content,
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
                const { userId } = context;

                if (!userId) {
                    throw new Error("You need to login first")
                }

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
