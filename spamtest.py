import aiohttp
import asyncio
import json

async def spam_url(session, url):
    try:
        async with session.get(url) as response:
            data = await response.text()
            return json.loads(data)['value']
    except Exception as e:
        print(f"Error occurred: {e}")
        return -1

async def main():
    url = "http://127.0.0.1:8787/counter?key=visitsttss"
    tasks = []

    async with aiohttp.ClientSession() as session:
        for _ in range(30000):
            task = asyncio.ensure_future(spam_url(session, url))
            tasks.append(task)

        responses = await asyncio.gather(*tasks)
        errored_connections = responses.count(-1)
        print(f"Errored connections: {errored_connections}")

        # Filter out errored connections
        responses = [int(response) for response in responses if response != -1]
        print(f"First value: {responses[0]}, Last value: {responses[-1]}")
        print(f"Difference: {responses[-1] - responses[0]}")
        print(f"Total: {len(responses)}")

# Python 3.7+
if __name__ == '__main__':
    asyncio.run(main())