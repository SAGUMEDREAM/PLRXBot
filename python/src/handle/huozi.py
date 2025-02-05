import os
from aiohttp import web
from pydub import AudioSegment
from io import BytesIO
from pypinyin import pinyin, Style

shengmu = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s",
           "y", "w"]
yunmu = ["a", "o", "e", "i", "u", "ü", "ai", "ei", "ao", "ou", "an", "en", "ang", "eng", "ong", "er"]
overall = ["zhi", "chi", "shi", "ri", "zi", "ci", "si", "yi", "wu", "yu", "ye", "yue", "yuan", "yin", "yun", "ying"]

# 拼音字典
PINYIN_DICT = set(overall)
for sm in shengmu:
    for ym in yunmu:
        PINYIN_DICT.add(sm + ym)
for ym in yunmu:
    PINYIN_DICT.add(ym)


def split_pinyin(input_pinyin):
    result = []
    temp = ""
    while input_pinyin:
        matched = False
        for i in range(len(input_pinyin), 0, -1):
            candidate = input_pinyin[:i]
            if candidate in PINYIN_DICT:
                result.append(candidate)
                input_pinyin = input_pinyin[i:]
                matched = True
                break
        if not matched:
            # print(f"Warning: 无法解析的拼音片段 '{input_pinyin}'")
            break
    return result


# 判断是否为中文
def is_chinese(text):
    return any('\u4e00' <= char <= '\u9fff' for char in text)


# 判断是否为拼音
def is_pinyin(text):
    return all(char.isalpha() for char in text)


class HuoZi:
    @staticmethod
    def text_to_audio_by_pinyin(texts, sound_dir):
        """
        将文本列表或拼音字符串转换为音频文件。
        """
        combined_audio = AudioSegment.silent(duration=0)

        for text in texts:
            if is_chinese(text):
                pinyin_list = [item[0] for item in pinyin(text, style=Style.NORMAL)]
            elif is_pinyin(text):
                pinyin_list = split_pinyin(text.lower())
            else:
                # print(f"Warning: 输入的内容无法识别: {text}")
                continue

            for pinyin_str in pinyin_list:
                sound_file = os.path.join(sound_dir, f"{pinyin_str}.wav")
                if os.path.exists(sound_file):
                    sound = AudioSegment.from_file(sound_file)
                    combined_audio += sound
                else:
                    # print(f"Warning: 音频文件 {pinyin_str}.wav 不存在，跳过。")
                    pass
        return combined_audio

    @staticmethod
    async def post(request):
        data = await request.post()
        texts = data.getall("texts")

        if not texts:
            return web.Response(text="Missing texts parameter", status=400)

        sound_dir = os.path.join(os.getcwd(), "resources", "huozi", "sounds")
        output_audio = HuoZi.text_to_audio_by_pinyin(texts, sound_dir)

        if output_audio is None:
            return web.Response(text="Failed to generate audio", status=500)

        audio_buffer = BytesIO()
        output_audio.export(audio_buffer, format="wav")
        audio_buffer.seek(0)

        return web.Response(body=audio_buffer.read(), content_type="audio/wav")
