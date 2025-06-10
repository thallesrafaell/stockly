import { PrismaClient } from "@/app/generated/prisma";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: ReturnType<typeof createPrismaClient> | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient();
};

let prisma: ReturnType<typeof createPrismaClient>;
if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = createPrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
