import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import prisma from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { db } from '$lib/server/prisma';
import { idToken } from '@lucia-auth/tokens';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	adapter: prisma(db),
	middleware: sveltekit(),
	transformDatabaseUser: (userData: any) => {
		return {
			id: userData.id,
			role: userData.role,
			email: userData.email,
			email_verified: userData.email_verified
		};
	}
});

export type Auth = typeof auth;

export const emailVerificationToken = idToken(auth, 'email_verification', {
	expiresIn: 60 * 60
});

export const passwordResetToken = idToken(auth, 'email_reset', {
	expiresIn: 60 * 60
});
