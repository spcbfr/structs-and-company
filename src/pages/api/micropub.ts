import type { APIContext } from "astro";

// Outputs: /builtwith.json
export async function POST({ request, params }: APIContext) {
	const authToken = request.headers.get("Authorization")?.replace('Bearer ', '')
	if (!authToken) {
		return new Response(null, {
			status: 401,
			statusText: 'Forbidden'
		})
	}

	const indieToken = fetch('https://tokens.indieauth.com/tokens', {
		method: "GET",
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + authToken
		}
	})

	return new Response(JSON.stringify(indieToken))


}
