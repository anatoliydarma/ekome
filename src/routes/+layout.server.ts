import { serializeNonPOJOs } from '$lib/server/utils';

export const load = ({ locals }) => {
	if (locals.user) {
		return {
			user: serializeNonPOJOs(locals.user)
		};
	}
};
