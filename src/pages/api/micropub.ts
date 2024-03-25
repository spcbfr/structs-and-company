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
function hasOwnProperty<T, K extends PropertyKey>(
	obj: T,
	prop: K
): obj is T & Record<K, unknown> {
	return Object.prototype.hasOwnProperty.call(obj, prop);
}


export async function POST({ request, site, url }: APIContext) {
	const contentType = request.headers.get('Content-type')
	let bodyAuthToken;
	if (contentType === "application/x-www-form-urlencoded") {
		bodyAuthToken = new URLSearchParams(await request.text()).get('access_token')
	}

	const headerAuthToken = request.headers.get("Authorization")?.replace('Bearer ', '')
	const authToken = headerAuthToken || bodyAuthToken

	if (!authToken) return Error(401, 'no token')

	const res = await fetch('https://tokens.indieauth.com/token', {
		method: "GET",
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + authToken
		}
	})

	const indieToken: IndieTokenResponse = await res.json()

	if (hasOwnProperty(indieToken, 'me') && indieToken.me !== site?.toString()) {
		return new Response(null, {
			statusText: "Created",
			status: 201,
			headers: {
				"Location": "https://yusuf.fyi/notes/2021"
			}
		})
	} else {
		return Error(401, 'invalid token')
	}

	//  TODO: Create note here

}
