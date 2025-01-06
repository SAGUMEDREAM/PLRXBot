from aiohttp import web
from src.markdown2img.data_source import md_to_pic


class Markdown2Image:
    @staticmethod
    async def post(request):
        try:
            data = await request.post()
            texts = data.getall('texts')

            if not texts:
                return web.Response(text="Missing texts parameter", status=400)

            markdown_content = "\n".join(texts)

            image_bytes = await md_to_pic(markdown_content)

            return web.Response(body=image_bytes, content_type='image/png')

        except Exception as e:
            return web.Response(text=f"Error: {str(e)}", status=500)
