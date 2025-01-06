import asyncio
from aiohttp import web
from src.webloader import WebLoader


loader = None
app = None


def main():
    global loader
    global app
    loader = WebLoader()
    # app = web.Application(middlewares=[log_middleware])
    app = web.Application()
    loader.init_route(app)

    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(loader.start_app(app))
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        loop.run_until_complete(loop.shutdown_asyncgens())
        loop.close()
