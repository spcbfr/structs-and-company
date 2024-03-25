import type { APIContext } from "astro";

// Outputs: /builtwith.json
export async function POST({ request, params }: APIContext) {
	const authToken = request.headers.get("Authorization")?.replace('Bearer ', '')
	if (!authToken) {
		return new Response(null, {
			status: 401,
			statusText: 'Unauthorized'
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

	if (typeof indieToken.me === 'undefined' && indieToken.me !== 'https://yusuf.fyi') {
		return new Response(null, {
			status: 401,
			statusText: 'Unauthorized'
		})
	}


	return new Response(null, {
		statusText: "Created",
		status: 201,
		headers: {
			"Location": "https://yusuf.fyi/notes/2021"
		}
	})
}
