import os
import mido
import numpy as np
from pydub import AudioSegment
from aiohttp import web


class OtmAudio:

    @staticmethod
    async def post(request):
        data = await request.post()
        midi_path = data["midi"]
        sample_path = data["sample"]

        if not os.path.exists(midi_path):
            return web.Response(text=f"错误: MIDI 文件 {midi_path} 不存在", status=400)
        if not os.path.exists(sample_path):
            return web.Response(text=f"错误: 采样文件 {sample_path} 不存在", status=400)

        output_file = "output.wav"
        midi_to_wav(midi_path, sample_path, output_file)

        with open(output_file, "rb") as f:
            audio_data = f.read()

        return web.Response(body=audio_data, content_type='audio/mpeg')

    @staticmethod
    async def get(request):
        midi_path = request.query.get("midi")
        sample_path = request.query.get("sample")

        if not os.path.exists(midi_path):
            return web.Response(text=f"错误: MIDI 文件 {midi_path} 不存在", status=400)
        if not os.path.exists(sample_path):
            return web.Response(text=f"错误: 采样文件 {sample_path} 不存在", status=400)

        output_file = "output.wav"
        midi_to_wav(midi_path, sample_path, output_file)

        with open(output_file, "rb") as f:
            audio_data = f.read()

        return web.Response(body=audio_data, content_type='audio/mpeg')


def midi_to_wav(midi_file, sample_file, output_file):
    print(f"处理中: MIDI = {midi_file}, Sample = {sample_file}")

    # 读取 MIDI 文件
    mid = mido.MidiFile(midi_file)
    sample = AudioSegment.from_file(sample_file)

    print(f"MIDI 轨道数: {len(mid.tracks)}, 采样时长: {len(sample)} ms")

    output = AudioSegment.silent(duration=0)
    tempo = 500000  # 默认 120 BPM (500000 微秒每四分音符)
    ticks_per_beat = mid.ticks_per_beat

    time_position = 0  # 记录合成音频的时间位置
    active_notes = {}  # 记录当前活跃的音符 {note: (start_time, velocity)}

    for track in mid.tracks:
        time_position = 0
        active_notes = {}

        for msg in track:
            if msg.type == 'set_tempo':
                tempo = msg.tempo

            time_position += mido.tick2second(msg.time, ticks_per_beat, tempo)

            if msg.type == 'note_on' and msg.velocity > 0:
                print(f"note_on: {msg.note}, {time_position:.3f}s")
                active_notes[msg.note] = (time_position, msg.velocity)

            elif msg.type in ('note_off', 'note_on') and msg.note in active_notes:
                start_time, velocity = active_notes.pop(msg.note)
                duration = time_position - start_time

                # 计算音高偏移（假设采样是 C4=60）
                semitone_shift = msg.note - 60
                sample_shifted = sample._spawn(
                    sample.raw_data, overrides={
                        "frame_rate": int(sample.frame_rate * (2 ** (semitone_shift / 12.0)))
                    }
                ).set_frame_rate(sample.frame_rate)

                note_audio = sample_shifted[:int(duration * 1000)]  # 截取合适长度
                output = output.overlay(note_audio, position=int(start_time * 1000))

                print(f"合成音符 {msg.note}, 开始 {start_time:.3f}s, 持续 {duration:.3f}s")

    if len(output.raw_data) == 0:
        print("错误: 生成的音频为空！")
    else:
        print(f"导出音频: {output_file}, 长度: {len(output) / 1000:.2f} 秒")

    output.export(output_file, format="wav")
