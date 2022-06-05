import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const newMemo = await prisma.memo.create({
        data: {
            title: 'My First Memo',
            content: 'This is my first memo'                        
        }
    })
    const allMemos = await prisma.memo.findMany();
    console.log(allMemos);    
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect
    })