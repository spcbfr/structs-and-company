import type { APIContext } from "astro";
import { extendTailwindMerge } from "tailwind-merge";

// Outputs: /builtwith.json
export async function POST({ request, site, params }: APIContext) {
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

	if (typeof indieToken.me === 'undefined' && indieToken.me !== site) {
		return new Response(null, {
			status: 401,
			statusText: 'Unauthorized'
		})
	}

	//  TODO: Create note here
	let data;
	const contentType = request.headers.get('Content-type')
	if (contentType === 'application/x-www-form-urlencoded') {
		data = params
	} else {
		data = request.body
	}


	return new Response(JSON.stringify(data), {
		statusText: "Created",
		status: 201,
		headers: {
			"Location": "https://yusuf.fyi/notes/2021"
		}
	})
}
