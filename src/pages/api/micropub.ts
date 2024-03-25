import type { APIContext } from "astro";

export async function POST({ request, site, url }: APIContext) {

	const bodyAuthToken = url.searchParams.get("access_token")
	const headerAuthToken = request.headers.get("Authorization")?.replace('Bearer ', '')

	if (url.searchParams.has('access_token') && request.headers.has('Authorization')) {
		return new Response(null, {
			status: 400,
			statusText: 'invalid request'
		})
	}

	const authToken = bodyAuthToken || headerAuthToken

	if (!authToken) {
		return new Response(null, {
			status: 401,
			statusText: 'no token'
		})
	}

	const res = await fetch('https://tokens.indieauth.com/token', {
		method: "GET",
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + authToken
		}
	})
	const indieToken = await res.json()

	if (typeof indieToken.me === 'undefined' && indieToken.me !== site) {
		return new Response(null, {
			status: 401,
			statusText: 'invalid token'
		})
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
