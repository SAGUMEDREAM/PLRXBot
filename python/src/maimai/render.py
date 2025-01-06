import asyncio

# from nonebot_plugin_htmlrender import template_to_pic

from src.maimai.schema import RenderProps
from src.maimai.config import TEMPLATES_DIR
from src.maimai.utils import calc_star_count
from src.maimai.filters import star_count_to_color, level_index_to_color, course_rank_id_to_text
from src.markdown2img.data_source import template_to_pic


async def render_b50(props: RenderProps) -> bytes:
    # print(props)
    tasks = [calc_star_count(score) for score in props.standard + props.dx]
    star_counts = await asyncio.gather(*tasks)

    for score, star_count in zip(props.standard + props.dx, star_counts):
        score.star_count = star_count  # type: ignore

    return await template_to_pic(
        template_path=str(TEMPLATES_DIR),
        template_name="best50.html.jinja2",
        templates={
            "player": props.player,
            "standard_total": props.standard_total,
            "dx_total": props.dx_total,
            "standard": props.standard,
            "dx": props.dx,
        },
        filters={
            "level_index_to_color": level_index_to_color,
            "star_count_to_color": star_count_to_color,
            "course_rank_id_to_text": course_rank_id_to_text,
        },
        pages={
            "viewport": {"width": 1080, "height": 1512},
            "base_url": f"file://{TEMPLATES_DIR}",
        },
    )
