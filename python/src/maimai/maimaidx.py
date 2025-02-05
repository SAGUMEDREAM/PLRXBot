import asyncio
import io
from io import BytesIO
from typing import Optional, Union
from PIL import Image, ImageDraw
from src.maimai.maimaidx_api_data import MaimaiAPI
from src.maimai.maimaidx_model import UserInfo, ChartInfo, PlayInfoDefault, PlayInfoDev
from src.maimai.maimaidx_error import *
from src.maimai.maimaidx_music import mai, loadMusic
from src.maimai.image import DrawText, image_to_base64
from src.maimai.config import *

maiApi = MaimaiAPI()


async def generateBest50(qqid: Optional[int] = None, username: Optional[str] = None) -> bytes:
    try:
        if username:
            qqid = None
        obj = await maiApi.query_user('player', qqid=qqid, username=username)

        mai_info = UserInfo(**obj)
        draw_best = DrawBest(mai_info, qqid)

        pic = await draw_best.draw()

        img_byte_arr = io.BytesIO()
        pic.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        return img_byte_arr.getvalue()

    except UserNotFoundError as e:
        return str(e).encode()
    except UserDisabledQueryError as e:
        return str(e).encode()
    except Exception as e:
        return f'未知错误：{type(e)}\n请联系Bot管理员'.encode()



def dxScore(dx: int) -> int:
    """
    返回值为 `Tuple`： `(星星种类，数量)`
    """
    if dx <= 85:
        result = 0
    elif dx <= 90:
        result = 1
    elif dx <= 93:
        result = 2
    elif dx <= 95:
        result = 3
    elif dx <= 97:
        result = 4
    else:
        result = 5
    return result


def getCharWidth(o) -> int:
    widths = [
        (126, 1), (159, 0), (687, 1), (710, 0), (711, 1), (727, 0), (733, 1), (879, 0), (1154, 1), (1161, 0),
        (4347, 1), (4447, 2), (7467, 1), (7521, 0), (8369, 1), (8426, 0), (9000, 1), (9002, 2), (11021, 1),
        (12350, 2), (12351, 1), (12438, 2), (12442, 0), (19893, 2), (19967, 1), (55203, 2), (63743, 1),
        (64106, 2), (65039, 1), (65059, 0), (65131, 2), (65279, 1), (65376, 2), (65500, 1), (65510, 2),
        (120831, 1), (262141, 2), (1114109, 1),
    ]
    if o == 0xe or o == 0xf:
        return 0
    for num, wid in widths:
        if o <= num:
            return wid
    return 1


def coloumWidth(s: str) -> int:
    res = 0
    for ch in s:
        res += getCharWidth(ord(ch))
    return res


def changeColumnWidth(s: str, len: int) -> str:
    res = 0
    sList = []
    for ch in s:
        res += getCharWidth(ord(ch))
        if res <= len:
            sList.append(ch)
    return ''.join(sList)


class Draw:
    basic = Image.open(maimaidir / 'b50_score_basic.png')
    advanced = Image.open(maimaidir / 'b50_score_advanced.png')
    expert = Image.open(maimaidir / 'b50_score_expert.png')
    master = Image.open(maimaidir / 'b50_score_master.png')
    remaster = Image.open(maimaidir / 'b50_score_remaster.png')
    title_bg = Image.open(maimaidir / 'title2.png').resize((600, 120))
    design_bg = Image.open(maimaidir / 'design.png').resize((1320, 120))
    _diff = [basic, advanced, expert, master, remaster]

    def __init__(self, image: Image.Image = None) -> None:
        self._im = image
        dr = ImageDraw.Draw(self._im)
        self._mr = DrawText(dr, MEIRYO)
        self._sy = DrawText(dr, SIYUAN)
        self._tb = DrawText(dr, TBFONT)

    async def whiledraw(self, data: Union[List[ChartInfo], List[PlayInfoDefault], List[PlayInfoDev]], best: bool,
                        height: int = 0) -> None:
        # y为第一排纵向坐标，dy为各排间距
        dy = 170
        if data and isinstance(data[0], ChartInfo):
            y = 430 if best else 1700
        else:
            y = height
        TEXT_COLOR = [(255, 255, 255, 255), (255, 255, 255, 255), (255, 255, 255, 255), (255, 255, 255, 255),
                      (138, 0, 226, 255)]
        x = 70
        for num, info in enumerate(data):
            if num % 5 == 0:
                x = 70
                y += dy if num != 0 else 0
            else:
                x += 416

            cover = Image.open(await maiApi.download_music_pictrue(info.song_id)).resize((135, 135))
            version = Image.open(maimaidir / f'{info.type.upper()}.png').resize((55, 19))
            if info.rate.islower():
                rate = Image.open(maimaidir / f'UI_TTR_Rank_{score_Rank_l[info.rate]}.png').resize((95, 44))
            else:
                rate = Image.open(maimaidir / f'UI_TTR_Rank_{info.rate}.png').resize((95, 44))

            self._im.alpha_composite(self._diff[info.level_index], (x, y))
            self._im.alpha_composite(cover, (x + 5, y + 5))
            self._im.alpha_composite(version, (x + 80, y + 141))
            self._im.alpha_composite(rate, (x + 150, y + 98))
            if info.fc:
                fc = Image.open(maimaidir / f'UI_MSS_MBase_Icon_{fcl[info.fc]}.png').resize((45, 45))
                self._im.alpha_composite(fc, (x + 246, y + 99))
            if info.fs:
                fs = Image.open(maimaidir / f'UI_MSS_MBase_Icon_{fsl[info.fs]}.png').resize((45, 45))
                self._im.alpha_composite(fs, (x + 291, y + 99))

            dxscore = sum(mai.total_list.by_id(str(info.song_id)).charts[info.level_index].notes) * 3
            dxnum = dxScore(info.dxScore / dxscore * 100)
            if dxnum:
                self._im.alpha_composite(Image.open(maimaidir / f'UI_GAM_Gauge_DXScoreIcon_0{dxnum}.png'),
                                         (x + 335, y + 102))

            self._tb.draw(x + 40, y + 148, 20, info.song_id, TEXT_COLOR[info.level_index], anchor='mm')
            title = info.title
            if coloumWidth(title) > 18:
                title = changeColumnWidth(title, 17) + '...'
            self._sy.draw(x + 155, y + 20, 20, title, TEXT_COLOR[info.level_index], anchor='lm')
            self._tb.draw(x + 155, y + 50, 32, f'{info.achievements:.4f}%', TEXT_COLOR[info.level_index], anchor='lm')
            self._tb.draw(x + 338, y + 82, 20, f'{info.dxScore}/{dxscore}', TEXT_COLOR[info.level_index], anchor='mm')
            self._tb.draw(x + 155, y + 82, 22, f'{info.ds} -> {info.ra}', TEXT_COLOR[info.level_index], anchor='lm')


class DrawBest(Draw):

    def __init__(self, UserInfo: UserInfo, qqId: Optional[Union[int, str]] = None) -> None:
        super().__init__(Image.open(maimaidir / 'b50_bg.png').convert('RGBA'))
        self.userName = UserInfo.nickname
        self.plate = UserInfo.plate
        self.addRating = UserInfo.additional_rating
        self.Rating = UserInfo.rating
        self.sdBest = UserInfo.charts.sd
        self.dxBest = UserInfo.charts.dx
        self.qqId = qqId

    def _findRaPic(self) -> str:
        if self.Rating < 1000:
            num = '01'
        elif self.Rating < 2000:
            num = '02'
        elif self.Rating < 4000:
            num = '03'
        elif self.Rating < 7000:
            num = '04'
        elif self.Rating < 10000:
            num = '05'
        elif self.Rating < 12000:
            num = '06'
        elif self.Rating < 13000:
            num = '07'
        elif self.Rating < 14000:
            num = '08'
        elif self.Rating < 14500:
            num = '09'
        elif self.Rating < 15000:
            num = '10'
        else:
            num = '11'
        return f'UI_CMN_DXRating_{num}.png'

    def _findMatchLevel(self) -> str:
        if self.addRating <= 10:
            num = f'{self.addRating:02d}'
        else:
            num = f'{self.addRating + 1:02d}'
        return f'UI_DNM_DaniPlate_{num}.png'

    async def draw(self) -> Image.Image:

        logo = Image.open(maimaidir / 'logo.png').resize((378, 172))
        dx_rating = Image.open(maimaidir / self._findRaPic()).resize((300, 59))
        Name = Image.open(maimaidir / 'Name.png')
        MatchLevel = Image.open(maimaidir / self._findMatchLevel()).resize((134, 55))
        ClassLevel = Image.open(maimaidir / 'UI_FBR_Class_00.png').resize((144, 87))
        rating = Image.open(maimaidir / 'UI_CMN_Shougou_Rainbow.png').resize((454, 50))

        self._im.alpha_composite(logo, (5, 130))
        if self.plate:
            plate = Image.open(platedir / f'{self.plate}.png').resize((1420, 230))
        else:
            plate = Image.open(maimaidir / 'UI_Plate_300501.png').resize((1420, 230))
        self._im.alpha_composite(plate, (390, 100))
        icon = Image.open(maimaidir / 'UI_Icon_309503.png').resize((214, 214))
        self._im.alpha_composite(icon, (398, 108))
        if self.qqId:
            try:
                qqLogo = Image.open(BytesIO(await maiApi.qqlogo(self.qqId)))
                self._im.alpha_composite(Image.new('RGBA', (203, 203), (255, 255, 255, 255)), (404, 114))
                self._im.alpha_composite(qqLogo.convert('RGBA').resize((201, 201)), (405, 115))
            except Exception:
                pass
        self._im.alpha_composite(dx_rating, (620, 122))
        Rating = f'{self.Rating:05d}'
        for n, i in enumerate(Rating):
            self._im.alpha_composite(Image.open(maimaidir / f'UI_NUM_Drating_{i}.png').resize((28, 34)),
                                     (760 + 23 * n, 137))
        self._im.alpha_composite(Name, (620, 200))
        self._im.alpha_composite(MatchLevel, (935, 205))
        self._im.alpha_composite(ClassLevel, (926, 105))
        self._im.alpha_composite(rating, (620, 275))

        self._sy.draw(635, 235, 40, self.userName, (0, 0, 0, 255), 'lm')
        sdrating, dxrating = sum([_.ra for _ in self.sdBest]), sum([_.ra for _ in self.dxBest])
        self._tb.draw(847, 295, 28, f'B35: {sdrating} + B15: {dxrating} = {self.Rating}', (0, 0, 0, 255), 'mm', 3,
                      (255, 255, 255, 255))
        self._mr.draw(900, 2465, 35, f'Designed by Yuri-YuzuChaN & BlueDeer233 | Generated by {maiconfig.botName} BOT',
                      (0, 50, 100, 255), 'mm', 3, (255, 255, 255, 255))

        await self.whiledraw(self.sdBest, True)
        await self.whiledraw(self.dxBest, False)

        return self._im.resize((1760, 2000))


def initMai():
    pass
