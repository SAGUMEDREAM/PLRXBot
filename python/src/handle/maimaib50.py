from aiohttp import web

from src.maimai.maimaidx import generateBest50
from src.markdown2img.data_source import md_to_pic

import httpx


class MaiMaiB50:
    songs_list = None
    genres_list = None
    versions_list = None

    @staticmethod
    async def post(request):
        data = await request.post()
        qq = data.get("qq")

        return web.Response(body="", content_type='image/png')

    @staticmethod
    async def get(request):
        qq = request.query.get("qq")

        return web.Response(body=await generateBest50(qqid=qq), content_type='image/png')
