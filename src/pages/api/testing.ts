import type { APIContext } from "astro";

export async function POST({ request, site, url }: APIContext) {

	const body = await request.text()

	console.log(body)
	return new Response(null, {
		status: 200,
		headers: {
			"Location": "https://yusuf.fyi/notes/2021"
		}
	})
}
