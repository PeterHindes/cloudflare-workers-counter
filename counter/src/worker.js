export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const params = new URLSearchParams(url.search);
		const key = params.get("key");
		const inc = params.get("inc");
		if (url.pathname !== "/counter" || !key || !inc) {
			console.log(url.pathname);
			return new Response("Not found", { status: 404 });
		}

		// Increment the counter in the Cloudflare KV namespace
		let value = await env.DB.prepare("SELECT * FROM counters WHERE key = ?").bind(key).first();
		console.log(value);
		if (value == null) {
			if (inc == 'false') {
				value = {
					key: key,
					value: 0,
				};
			} else if (inc == 'true') {
				await env.DB.prepare("INSERT INTO counters (key, value) VALUES (?, ?)").bind(key, 1).run();
				value = await env.DB.prepare("SELECT * FROM counters WHERE key = ?").bind(key).first();
			}
		} else {
			if (inc == 'true'){
				await env.DB.prepare("UPDATE counters SET value = value + 1 WHERE key = ?").bind(key).run();
				value = await env.DB.prepare("SELECT * FROM counters WHERE key = ?").bind(key).first();
			}
		}

		return new Response(JSON.stringify(await value), {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});
	},
};
