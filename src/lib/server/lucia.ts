import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { mysql2 } from '@lucia-auth/adapter-mysql';
import mysql from 'mysql2/promise';
import { dev } from '$app/environment';
import { idToken } from '@lucia-auth/tokens';
import { env } from '$env/dynamic/private';
const dbUsername = env.DB_USERNAME;
const dbPassword = env.DB_PASSWORD;
const dbDatabase = env.DB_DATABASE;

const poolConnection = mysql.createPool({
	user: dbUsername,
	database: dbDatabase,
	password: dbPassword
});

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	adapter: mysql2(poolConnection),
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
