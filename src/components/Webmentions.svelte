<script lang="ts">
  import { onMount } from "svelte";
  import { Render } from "@jill64/svelte-sanitize";

  export let urlSlug;

  const sendingURL = "https://webmention.io/yusuf.fyi/webmention";
  let sourceURL: string;
  let error: string;
  let note: string;

  const send = async () => {
    try {
      const response = await fetch(sendingURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `source=${encodeURIComponent(sourceURL)}&target=${encodeURIComponent(target)}`,
      });

      if (response.ok) {
        sourceURL = "";
        note =
          "Your webmention is being processed! please refresh this page in a couple of seconds";
      } else {
        error = "Failed to send webmention. Please try again later.";
      }
    } catch (err: any) {
      error = err;
    }
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!sourceURL) {
      error = "Please fill in the URL";
      return;
    }
    await send();
  }

  const target = "https://yusuf.fyi/" + urlSlug;
  const reqURL = `https://webmention.io/api/mentions.jf2?target=${target}`;
  const targetDeprecated = "https://www.yusuf.fyi/" + urlSlug;
  const reqURLDeprecated = `https://webmention.io/api/mentions.jf2?target=${targetDeprecated}`;

  async function loadingWebmentions() {
    const newData = await fetch(reqURL).then((res) => res.json());
    const oldData = await fetch(reqURLDeprecated).then((res) => res.json());
    return [...newData.children, ...oldData.children];
  }

  let asyncWebmentions = loadingWebmentions();

  onMount(() => {
    asyncWebmentions = loadingWebmentions();
    console.log(asyncWebmentions);
  });

  function filterComments(children: any) {
    return children.filter(
      (entry: any) => entry["wm-property"] === "in-reply-to",
    );
  }

  function filterLikes(children: any) {
    return children.filter(
      (entry: any) => entry["wm-property"] === "like-of" && entry.author.photo,
    );
  }
  function filterReposts(children: any) {
    return children.filter(
      (entry: any) =>
        entry["wm-property"] === "repost-of" && entry.author.photo,
    );
  }

  function filterMentions(children: any) {
    return children.filter(
      (entry: any) => entry["wm-property"] === "mention-of",
    );
  }
</script>

<div>
  <section
    class="space-y-1 bg-[#F1EFE4] py-2 px-3 sm:static sm:mx-0 sm:w-full relative w-screen left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] rounded-sm mt-5"
  >
    <form class="mb-3 space-y-1" on:submit={handleSubmit}>
      <label for="reply" class="font-semibold"
        >Have you written a <a
          href="https://indieweb.org/reply"
          class="text-amber-700 underline underline-offset-2">reply</a
        > to this post? Let me know the URL</label
      >
      <div class="flex gap-2">
        <input
          type="url"
          name="reply"
          class="w-full rounded-sm border-stone-300 border-2 bg-stone-100"
          bind:value={sourceURL}
          required
        />
        <button
          class="bg-amber-900 rounded-sm font-semibold text-amber-100 hover:bg-amber-950 transition-colors px-3 py-1"
          >Send</button
        >
      </div>
      <p class="text-red-600 font-medium">{error ? error : ""}</p>
      <p class="text-green-600 font-medium">
        {note ? note : ""}
      </p>
    </form>
    {#await asyncWebmentions}
      <p>Loading Webmentions…</p>
    {:then data}
      {#if data.length !== 0}
        {#if filterLikes(data).length !== 0}
          <section class="flex items-center flex-wrap gap-1 mt-3">
            <span
              class="text-3xl select-none text-stone-900/80 w-12 mr-2 text-center"
              >★</span
            >
            {#each filterLikes(data) as like}
              <span class="">
                <img
                  src={like.author.photo}
                  width="36"
                  class=" rounded-sm"
                  alt={like.author.name}
                />
              </span>
            {/each}
          </section>
        {/if}

        {#if filterReposts(data).length !== 0}
          <section class="flex items-center flex-wrap gap-1 mt-3">
            <span
              class="text-3xl relative left-2 select-none text-stone-900/80 w-12 mr-2 text-center"
            >
              <svg
                height="32"
                id="repost"
                viewBox="0 0 32 32"
                width="32"
                class="fill-stone-900/80"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  d=" M7 7 L14 14 L9 14 L9 20 L16 20 L16 24 L5 24 L5 14 L0 14 z M16 8 L27 8 L27 18 L32 18 L25 25 L18 18 L23 18 L23 12 L16 12z "
                /></svg
              >
            </span>
            {#each filterReposts(data) as like}
              <span class="">
                <img
                  src={like.author.photo}
                  width="36"
                  class=" rounded-sm"
                  alt={like.author.name}
                />
              </span>
            {/each}
          </section>
        {/if}

        <section class="flex flex-col gap-1">
          {#if filterComments(data).length !== 0}
            {#each filterComments(data) as comment}
              <article class="flex mt-3 items-start gap-3 py-1">
                <img
                  src={comment.author.photo}
                  width={48}
                  height={48}
                  alt=""
                  class="rounded-[4px]"
                />
                <div>
                  <div class="flex gap-1 mb-1">
                    <h3
                      class="text-sm text-amber-700 font-medium hover:underline underline-offset-1"
                    >
                      <a href={comment.author.url}>{comment.author.name}</a>
                    </h3>
                    <a
                      href={comment.author.url}
                      class=" hover:underline underline-offset-1 text-sm text-stone-500"
                      >{comment.author.url.replace(/(^\w+:|^)\/\//, "")}</a
                    >
                  </div>
                  <div>
                    {#if comment.content.html}
                      <p class="[&_a]:text-amber-700 [&_a]:font-semibold">
                        <Render html={comment.content.html} />
                      </p>
                    {:else}
                      <p class="[&_a]:text-amber-700 [&_a]:font-semibold">
                        {comment.content.text}
                      </p>
                    {/if}
                    <a
                      href={comment.url}
                      class="hover:underline underline-offset-1"
                    >
                      <time
                        class="text-sm text-stone-700"
                        datetime={new Date(
                          comment["wm-received"],
                        ).toISOString()}
                        >{new Date(comment["wm-received"]).toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}</time
                      >
                    </a>
                  </div>
                </div>
              </article>
            {/each}
          {/if}

          {#if filterMentions(data).length !== 0}
            {#each filterMentions(data) as comment}
              <article class="flex mt-3 items-start gap-3 py-1">
                <img
                  src={comment.author.photo}
                  width={48}
                  height={48}
                  alt=""
                  class="rounded-[4px]"
                />
                <div>
                  <div class="flex gap-1 mb-1">
                    <h3
                      class="text-sm text-amber-700 font-medium hover:underline underline-offset-1"
                    >
                      <a href={comment.author.url}>{comment.author.name}</a>
                    </h3>
                    <a
                      href={comment.author.url}
                      class=" hover:underline underline-offset-1 text-sm text-stone-500"
                      >{comment.author.url.replace(/(^\w+:|^)\/\//, "")}</a
                    >
                  </div>

                  <div>
                    <p>
                      Mentioned in <a
                        href={comment.url}
                        class="font-medium text-amber-700"
                        >{comment.url.replace(/(^\w+:|^)\/\//, "")}</a
                      >
                    </p>
                    <a
                      href={comment.url}
                      class="hover:underline underline-offset-1"
                    >
                      <time
                        class="text-sm text-stone-700"
                        datetime={new Date(
                          comment["wm-received"],
                        ).toISOString()}
                        >{new Date(comment["wm-received"]).toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}</time
                      >
                    </a>
                  </div>
                </div>
              </article>
            {/each}
          {/if}
        </section>
      {/if}
    {/await}
  </section>
</div>
