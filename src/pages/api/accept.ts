import type { APIRoute } from "astro";

export const GET: APIRoute = ({ url }) => {
    const price = parseFloat(url.searchParams.get("p") ?? "5");

    return new Response(
        JSON.stringify({
            status: "success",
            price,
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
};
