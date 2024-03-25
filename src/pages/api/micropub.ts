import type { APIContext } from "astro";

interface SuccessfulIndieToken {
	me: string;
	client_id: string;
	scope: string;
	issued_at: number;
	nonce: number;
}

interface ErrorIndieToken {
	error: string;
	error_description: string;
}

type IndieTokenResponse = SuccessfulIndieToken | ErrorIndieToken;

function Error(code: number, message: string) {
	return new Response(null, {
		statusText: message,
		status: code
	})
}


export async function POST({ request, site, url }: APIContext) {

	const authToken = request.headers.get("Authorization")?.replace('Bearer ', '')

	if (!authToken) return Error(401, 'no token')

	const res = await fetch('https://tokens.indieauth.com/token', {
		method: "GET",
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + authToken
		}
	})

	const indieToken: IndieTokenResponse = await res.json()

	if ('me' in indieToken && indieToken.me !== site?.toString()) {
		return Error(401, 'invalid token')
	}

	//  TODO: Create note here

	return new Response(null, {
		statusText: "Created",
		status: 201,
		headers: {
			"Location": "https://yusuf.fyi/notes/2021"
		}
	})
}
