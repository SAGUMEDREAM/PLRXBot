from typing import Optional, List

from pydantic import BaseModel

from src.maimai.schema.enum import FCType, FSType, RateType, SongType


class CollectionGenre(BaseModel):
    """收藏品分类"""

    id: int
    """收藏品分类 ID"""
    title: str
    """分类标题"""
    genre: str
    """分类标题（日文）"""


class CollectionRequiredSong(BaseModel):
    """收藏品要求曲目"""

    id: int
    """曲目 ID"""
    title: str
    """曲名"""
    type: SongType
    """谱面类型"""
    completed: Optional[bool] = None
    """值可空，要求的曲目是否完成"""
    completed_difficulties: Optional[List[int]] = None
    """值可空，已完成的难度"""


class CollectionRequired(BaseModel):
    """收藏品要求"""

    difficulties: Optional[List[int]] = None
    """	值可空，要求的谱面难度"""
    rate: Optional[RateType] = None
    """	值可空，要求的评级类型"""
    fc: Optional[FCType] = None
    """	值可空，要求的 FULL COMBO 类型"""
    fs: Optional[FSType] = None
    """	值可空，要求的 FULL SYNC 类型"""
    songs: Optional[List[CollectionRequiredSong]] = None
    """	值可空，要求的曲目"""
    completed: Optional[bool] = None
    """值可空，要求是否全部完成"""


class Collection(BaseModel):
    """收藏品"""

    id: int
    """收藏品 ID"""
    name: str
    """收藏品名称"""
    color: Optional[str] = None
    """值可空，仅玩家称号，称号颜色"""
    description: Optional[str] = None
    """收藏品说明"""
    genre: Optional[str] = None
    """值可空，除玩家称号，收藏品分类（日文）"""
    required: Optional[List[CollectionRequired]] = None
    """值可空，收藏品要求"""
