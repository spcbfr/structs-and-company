import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {

	const posts = (await getCollection("blog"))
		.filter(post => !post.data.archived)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
	return rss({
		title: "Structs & Company | Yusuf Bouzekri",
		description: "A hacker's best friend",
		stylesheet: "/styles.xsl",
		site: context.site,
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
		},
		customData: `<atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />`,
		items: posts.map((post) => ({
			...post.data,
			link: `/posts/${post.slug}/`,
			author: "yusufbouzekri@gmail.com - (Yusuf Bouzekri)"
		})),
	});
}
