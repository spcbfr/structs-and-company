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
    return children.filter(
      (entry) =>
        entry["wm-property"] === "like-of" ||
        entry["wm-property"] ||
        "repost-of",
    );
  }
</script>

<div>
  {#if data}
    <section class="space-y-1 mt-5">
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

      <section class="flex flex-col gap-1">
        {#if filterComments(data.children) !== 0}
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
                  <p class="[&_a]:text-amber-700 [&_a]:font-semibold">
                    <Render html={comment.content.html} />
                  </p>
                  <a
                    href={comment.url}
                    class="hover:underline underline-offset-1"
                  >
                    <time
                      class="text-sm text-stone-700"
                      datetime={new Date(comment["wm-received"]).toISOString()}
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
</div>
