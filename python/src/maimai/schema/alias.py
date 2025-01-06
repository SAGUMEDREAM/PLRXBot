from pydantic import BaseModel
from typing import List


class Alias(BaseModel):
    """曲目别名"""

    song_id: int
    """曲目 ID"""
    aliases: List[int]
    """曲目所有别名"""
