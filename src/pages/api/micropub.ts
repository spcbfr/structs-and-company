import type { APIContext } from "astro";
import { db, Note } from "astro:db";
import { record } from "zod";
import dayjs from "dayjs";

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

function Respond(code: number, message?: string, headers?: HeadersInit) {
  return new Response(null, {
    statusText: message ?? undefined,
    status: code,
    headers: headers ?? undefined,
  });
}
function hasOwnProperty<T, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function paramsToObject(entries: any) {
  const result: any = {};
  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
}

export async function POST({ request, site, url }: APIContext) {
  const contentType = request.headers.get("Content-type");
  let bodyAuthToken;
  let formBodyObject;
  if (contentType === "application/x-www-form-urlencoded") {
    let formBody = new URLSearchParams(await request.text());
    formBodyObject = paramsToObject(formBody);

    bodyAuthToken = formBody.get("access_token");
  }

  const headerAuthToken = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  // NOTE: rejecting multiple authentication attempts as per RFC 6750
  if (headerAuthToken && bodyAuthToken) {
    return Respond(400, "invalid request");
  }

  const authToken = headerAuthToken || bodyAuthToken;

  if (!authToken) return Respond(401);

  const res = await fetch("https://tokens.indieauth.com/token", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + authToken,
    },
  });

  const indieToken: IndieTokenResponse = await res.json();

  if (hasOwnProperty(indieToken, "me") && indieToken.me === site?.toString()) {
    //  TODO: Create note here
    const now = dayjs().unix();

    console.log("hello world");
    if (contentType === "application/x-www-form-urlencoded") {
      if (!hasOwnProperty(formBodyObject, "content")) return Respond(422);

      const records = await db
        .insert(Note)
        .values({ content: formBodyObject.content, published: now })
        .returning();

      return Respond(201, "Created", {
        Location: "https://yusuf.fyi/notes/" + records[0].published,
      });
    }
    if (contentType === "application/json") {
      const body = await request.json();
      if (typeof body.properties.content[0] === "string") {
        const records = await db
          .insert(Note)
          .values({ content: body.properties.content[0], published: now })
          .returning();

        return Respond(201, "Created", {
          Location: "https://yusuf.fyi/notes/" + records[0].published,
        });
      }
    }
  } else {
    return Respond(401, "invalid token");
  }
}
