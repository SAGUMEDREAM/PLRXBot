from pydantic import BaseModel
from typing import List

from src.maimai.schema.song import Song as Song
from src.maimai.schema.alias import Alias as Alias
from src.maimai.schema.genre import Genre as Genre
from src.maimai.schema.notes import Notes as Notes
from src.maimai.schema.score import Score as Score
from src.maimai.schema.trend import Trend as Trend
from src.maimai.schema.player import Player as Player
from src.maimai.schema.version import Version as Version
from src.maimai.schema.collection import Collection as Collection
from src.maimai.schema.song import SongDifficulty as SongDifficulty
from src.maimai.schema.song import SongDifficulties as SongDifficulties
from src.maimai.schema.song import SongDifficultyUtage as SongDifficultyUtage
from src.maimai.schema.collection import CollectionRequired as CollectionRequired
from src.maimai.schema.collection import CollectionRequiredSong as CollectionRequiredSong


class RenderProps(BaseModel):
    player: Player
    standard_total: int
    dx_total: int
    standard: List[Score]
    dx: List[Score]
