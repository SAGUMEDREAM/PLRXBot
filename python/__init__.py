import asyncio

from src.maimai.maimaidx import initMai
from src.maimai.maimaidx_music import loadMusic
from src.main import main

if __name__ == "__main__":
    initMai()

    loop = asyncio.get_event_loop()
    task_load_music = loop.create_task(loadMusic())

    task_main = loop.create_task(main())
    try:
        loop.run_until_complete(task_load_music)
        loop.run_forever()
    except Exception:
        print("Keyboard interrupt received, stopping...")
    finally:
        task_load_music.cancel()
        task_main.cancel()
        loop.run_until_complete(task_load_music)
        loop.run_until_complete(task_main)
        loop.run_until_complete(loop.shutdown_asyncgens())  # 关闭异步生成器
        loop.close()
