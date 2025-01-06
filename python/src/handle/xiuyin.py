import librosa
import numpy as np
import soundfile as sf
from io import BytesIO

from aiohttp import web

C_FREQUENCIES = {
    'C0': 16.35,
    'C1': 32.70,
    'C2': 65.41,
    'C3': 130.81,
    'C4': 261.63,
    'C5': 523.25,
    'C6': 1046.50,
    'C7': 2093.00,
    'C8': 4186.01,
}


def closest_C_note(frequency):
    distances = {note: abs(frequency - freq) for note, freq in C_FREQUENCIES.items()}
    closest_note = min(distances, key=distances.get)
    return closest_note, C_FREQUENCIES[closest_note]


def get_dominant_frequency(audio_data, sr):
    D = librosa.stft(audio_data)
    D_abs = np.abs(D)

    freqs = librosa.fft_frequencies(sr=sr)

    peak_freqs = np.argmax(D_abs, axis=0)

    dominant_freq = np.bincount(peak_freqs).argmax()

    return freqs[dominant_freq]


def pitch_shift_to_target_by_spectrum(audio_data, sr):
    current_pitch_hz = get_dominant_frequency(audio_data, sr)

    closest_note, closest_frequency = closest_C_note(current_pitch_hz)

    n_steps = librosa.hz_to_midi(closest_frequency) - librosa.hz_to_midi(current_pitch_hz)
    y_shifted = librosa.effects.pitch_shift(audio_data, sr=sr, n_steps=n_steps)

    return y_shifted, sr


class XiuYin:
    @staticmethod
    async def post(request):
        data = await request.post()
        url = data.get("url")

        if not url:
            return web.Response(text="未提供音频文件路径", status=400)

        try:
            audio_data, sr = librosa.load(url, sr=None)

            processed_audio, sr = pitch_shift_to_target_by_spectrum(audio_data, sr)

            buffer = BytesIO()
            sf.write(buffer, processed_audio, sr, format='WAV')
            buffer.seek(0)

            return web.Response(body=buffer.read(), content_type="audio/wav")

        except Exception as e:
            return web.Response(text=f"音频处理出错: {str(e)}", status=500)
