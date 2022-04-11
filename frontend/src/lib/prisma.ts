import pkg from '@prisma/client';
const { PrismaClient, Prisma } = pkg;

let prisma;

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

export default prisma;

export const PrismaClientKnownRequestError = Prisma?.PrismaClientKnownRequestError;
