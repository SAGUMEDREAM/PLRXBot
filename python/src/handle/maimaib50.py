from aiohttp import web

from src.maimai.apis.request import API
from src.maimai.render import render_b50
from src.maimai.schema import RenderProps
from src.maimai.config import Config, lxns_config
from src.maimai.exception import FetchUserException
from src.markdown2img.data_source import md_to_pic


class MaiMaiB50:
    @staticmethod
    async def post(request):
        data = await request.post()
        qq = data.get("qq")

        player = await API.get_player_info_by_qq(qq)
        if player is None:
            return web.Response(body=await md_to_pic("## 错误 \n玩家不存在\n 请确定您的QQ号是否绑定了落雪咖啡屋"), content_type='image/png')

        standard_total, dx_total, standard, dx = await API.get_bests(player.friend_code)
        props = RenderProps(
            player=player,
            standard_total=standard_total,
            dx_total=dx_total,
            standard=standard,
            dx=dx,
        )

        return web.Response(body=await render_b50(props), content_type='image/png')

    @staticmethod
    async def get(request):
        qq = request.query.get("qq")

        if not qq:
            return web.Response(
                body=await md_to_pic("## 错误 \n缺少参数 `qq`\n 请在URL中添加 `?qq=您的QQ号`"),
                content_type='image/png'
            )

        player = await API.get_player_info_by_qq(qq)
        if player is None:
            return web.Response(
                body=await md_to_pic("## 错误 \n玩家不存在\n \n 请确定您的QQ号是否绑定了落雪咖啡屋"),
                content_type='image/png'
            )

        standard_total, dx_total, standard, dx = await API.get_bests(player.friend_code)
        props = RenderProps(
            player=player,
            standard_total=standard_total,
            dx_total=dx_total,
            standard=standard,
            dx=dx,
        )

        # 渲染结果
        return web.Response(body=await render_b50(props), content_type='image/png')
