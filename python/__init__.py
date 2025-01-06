import asyncio

from src.main import main


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    task = loop.create_task(main())
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        print("Keyboard interrupt received, stopping...")
    finally:
        task.cancel()
        loop.run_until_complete(task)
        loop.run_until_complete(loop.shutdown_asyncgens())
        loop.close()