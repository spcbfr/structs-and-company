import type { APIContext } from "astro";

function Error(code: number, message: string) {
	return new Response(null, {
		status: code,
		statusText: message
	})
}

export async function POST({ request, site, url }: APIContext) {
	const contentType = request.headers.get('Content-type')

	let bodyAuthToken: string | null;

	if (contentType === "application/x-www-form-urlencoded") {

		let body = new URLSearchParams(await request.text())
		bodyAuthToken = body.get('access_token')

	} else if (contentType === "application/json") {

		let body = await request.json()
		bodyAuthToken = body['access_token']

	} else {
		return Error(400, 'invalid content-type')
	}

	const headerAuthToken = request.headers.get("Authorization")?.replace('Bearer ', '')

	if (url.searchParams.has('access_token') && bodyAuthToken !== null) {
		return Error(400, 'invalid request')
	}

	const authToken = bodyAuthToken || headerAuthToken
	if (!authToken) return Error(400, 'no token')

	const res = await fetch('https://tokens.indieauth.com/token', {
		method: "GET",
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + authToken
		}
	})
	const indieToken = await res.json()

	if (indieToken.me !== site) return Error(401, 'invalid token')

	//  TODO: Create note here



	return new Response(null, {
		statusText: "Created",
		status: 201,
		headers: {
			"Location": "https://yusuf.fyi/notes/2021"
		}
	})
}
