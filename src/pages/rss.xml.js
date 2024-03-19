import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: "Structs & Company | Yusuf Bouzekri",
		description: "A hacker's best friend",
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/posts/${post.slug}/`,
		})),
	});
}
