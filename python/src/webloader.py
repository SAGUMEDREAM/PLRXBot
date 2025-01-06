from src.browser import get_browser
from src.handle.huozi import HuoZi
from src.handle.maimaib50 import MaiMaiB50
from src.handle.markdown2image import Markdown2Image
from aiohttp import web

from src.handle.xiuyin import XiuYin

browser = None
# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)


# @web.middleware
# async def log_middleware(request, handler):
#     try:
#         response = await handler(request)
#         return response
#     except Exception as e:
#         logger.error(f"Error processing request {request.method} {request.path}: {str(e)}")
#         raise

class WebLoader:
    loader = None

    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.loader = self
            self.initialized = True
        pass

    async def start_app(self, app):
        global browser
        browser = await get_browser()
        port = 8099
        runner = web.AppRunner(app)
        print(f"Service running in port {port}")
        await runner.setup()
        site = web.TCPSite(runner, 'localhost', port)
        await site.start()

    def init_route(self, app):
        app.add_routes([web.post('/markdown', Markdown2Image.post)])
        app.add_routes([web.get('/b50', MaiMaiB50.get)])
        app.add_routes([web.post('/b50', MaiMaiB50.post)])
        app.add_routes([web.post('/huozi', HuoZi.post)])
        app.add_routes([web.post('/xiuyin', XiuYin.post)])
