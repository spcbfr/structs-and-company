<script>
  import { onMount } from "svelte";
  import { Render } from "@jill64/svelte-sanitize";

  export let urlSlug;

  let data;
  const target = "https://yusuf.fyi/" + urlSlug;
  const reqURL = `https://webmention.io/api/mentions.jf2?target=${target}`;

  onMount(() => {
    fetch(reqURL)
      .then((res) => res.json())
      .then((response) => {
        data = response;
      })
      .catch((error) => console.error("Error fetching data:", error));
  });

  function filterComments(children) {
    return children.filter((entry) => entry["wm-property"] === "in-reply-to");
  }

  function filterLikes(children) {
    return children.filter((entry) => entry["wm-property"] === "like-of");
  }
  function filterReposts(children) {
    return children.filter((entry) => entry["wm-property"] === "repost-of");
  }
</script>

<div>
  {#if data}
    {#if data.children.length !== 0}
      <section class="space-y-1 bg-[#F1EFE4] py-2 px-3 rounded-sm mt-5">
        {#if filterLikes(data.children).length !== 0}
          <section class="flex items-center flex-wrap gap-1 mt-3">
            <span
              class="text-3xl select-none text-stone-900/80 w-12 mr-2 text-center"
              >★</span
            >
            {#each filterLikes(data.children) as like}
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

        {#if filterReposts(data.children).length !== 0}
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
            {#each filterReposts(data.children) as like}
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
          {#if filterComments(data.children).length !== 0}
            {#each filterComments(data.children) as comment}
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
        </section>
      </section>
    {/if}
  {/if}
</div>
