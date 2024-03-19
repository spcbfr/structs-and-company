import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {

	const posts = (await getCollection("blog"))
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
	return rss({
		title: "Structs & Company | Yusuf Bouzekri",
		description: "A hacker's best friend",
		stylesheet: "/styles.xsl",
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/posts/${post.slug}/`,
			author: "yusufbouzekri@gmail.com (Yusuf Bouzekri)"
		})),
	});
}
