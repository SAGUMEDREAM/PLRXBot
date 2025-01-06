import os
from pathlib import Path

from pydantic import Field, BaseModel

# from nonebot.plugin import get_plugin_config

PROJECT_ROOT = os.getcwd()

RESOURCES_DIR: Path = Path(os.path.join(PROJECT_ROOT, "resources", "maimai"))
IMAGES_DIR: Path = Path(os.path.join(PROJECT_ROOT, "resources", "maimai", "images"))
TEMPLATES_DIR: Path = Path(os.path.join(PROJECT_ROOT, "resources", "maimai", "templates"))

COURSE_RANK = [
    "初学者",
    "初段",
    "二段",
    "三段",
    "四段",
    "五段",
    "六段",
    "七段",
    "八段",
    "九段",
    "十段",
    "真传",
    "真初段",
    "真二段",
    "真三段",
    "真四段",
    "真五段",
    "真六段",
    "真七段",
    "真八段",
    "真九段",
    "真十段",
    "真皆传",
    "里皆传",
]


class ScopedConfig(BaseModel):
    api_url: str = "https://maimai.lxns.net/api/v0/maimai"
    api_token: str = ""


class Config(BaseModel):
    maimai: ScopedConfig = Field(default_factory=ScopedConfig)
    """MaiMai Config"""


# config = get_plugin_config(Config).maimai
lxns_config = ScopedConfig()
lxns_config.api_token = "hT1094EA27K2_TXf8aaeZyEFEU3Ey0lR2G8OR9ohvm4="

# diving_config = ScopedConfig()
# diving_config.api_url =