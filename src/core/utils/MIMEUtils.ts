export class MIMEUtils {
  public static getType(buffer: ArrayBuffer): string {
    const arr = new Uint8Array(buffer).subarray(0, 4);
    let header = '';
    for (let i = 0; i < arr.length; i++) {
      header += arr[i]
        .toString(16)
        // .padStart(2, '0')
      ;
    }

    // 判断文件类型
    switch (header) {
      // Image Types
      case '89504e47': return 'image/png'; // PNG
      case 'ffd8ffe0':
      case 'ffd8ffe1':
      case 'ffd8ffe2': return 'image/jpeg'; // JPEG
      case '47494638': return 'image/gif'; // GIF
      case '424d': return 'image/bmp'; // BMP (Windows Bitmap)
      case '00000100': return 'image/webp'; // WebP

      // Audio Types
      case '52494646': return 'audio/wav'; // WAV
      case '49443303': return 'audio/mp3'; // MP3 (ID3 header)
      case '664c6143': return 'audio/flac'; // FLAC (Free Lossless Audio Codec)

      // Video Types
      case '00000020': return 'video/mp4'; // MP4 (Quicktime/ISO base media)
      case '1a45dfa3': return 'video/webm'; // WebM
      case '3026b275': return 'video/avi'; // AVI
      case '000001ba': return 'video/mpeg'; // MPEG (video stream)

      // Document Types
      case '25504446': return 'application/pdf'; // PDF
      case '504b0304': return 'application/zip'; // ZIP // DOCX (Office Open XML)
      case '504b0506': return 'application/zip'; // ZIP (Extended ZIP)

      // Executable Files
      case '4d5a9000': return 'application/x-msdos-program'; // EXE (Windows Executable)

      // Microsoft Office (Old and New)
      case 'd0cf11e0': return 'application/msword'; // DOC (Older Word formats)

      // Text Files
      case '74657374': return 'text/plain'; // Plain Text
      case 'efbbbf': return 'text/utf8'; // UTF-8 Encoded Text
      case '0d0a': return 'text/csv'; // CSV
      case '3c3f786d': return 'application/xml'; // XML (with BOM)

      // Default case
      default:
        return 'application/octet-stream'; // Fallback to binary stream if no match found
    }
  }
}
