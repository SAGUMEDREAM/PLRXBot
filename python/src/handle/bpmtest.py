import os
from aiohttp import web
import json

from src.utils.BpmDetector import detectWav


class BPMTest:

    @staticmethod
    async def post(request):
        data = await request.post()
        path = data["path"]

        if not os.path.exists(path):
            return web.Response(text=f"错误: 文件 {path} 不存在", status=400)

        bpm = detectWav(path)

        if bpm is None:
            return web.Response(text="无法检测到 BPM", status=400)

        return web.Response(
            text=json.dumps({"bpm": bpm}),
            content_type='application/json'
        )

    @staticmethod
    async def get(request):
        path = request.query.get("path")

        if not os.path.exists(path):
            return web.Response(text=f"错误: 文件 {path} 不存在", status=400)

        bpm = detectWav(path)

        if bpm is None:
            return web.Response(text="无法检测到 BPM", status=400)

        return web.Response(
            text=json.dumps({"bpm": bpm}),
            content_type='application/json'
        )
