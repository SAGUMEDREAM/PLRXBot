import { CommandProvider } from "../../../core/command/CommandProvider";
import { FileResult, FileState, MessageFiles } from "../../../core/network/MessageFiles";
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { h } from "koishi";
import { OtomadHelper } from "../index";
import {Constant} from "../../../core/Constant";
import axios from "axios";

export class CommandSoundCreation {

  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      try {
        await session.sendQueued('请发送MIDI文件');
        const midiFileMsg: string = await session.prompt(300000);
        if (!midiFileMsg) {
          return session.sendQueued("输入超时");
        }
        const midiFile: FileResult = await MessageFiles.getBuffer(session, midiFileMsg);

        await session.sendQueued('请发送采样文件');
        const audioFileMsg: string = await session.prompt(300000);
        if (!audioFileMsg) {
          return session.sendQueued("输入超时");
        }
        const audioFile: FileResult = await MessageFiles.getBuffer(session, audioFileMsg);

        if (midiFile.state === FileState.ERROR) {
          return await session.sendQueued(midiFile.message);
        } else if (audioFile.state === FileState.ERROR) {
          return await session.sendQueued(audioFile.message);
        }

        await session.sendQueued("正在处理中");

        const midiSrc = midiFile.data.src;
        const sampleSrc = audioFile.data.src;

        const wavBuffer = await this.getAudio(midiSrc, sampleSrc);

        // 生成随机文件名
        const randomString = randomBytes(6).toString('hex'); // 生成 16 位随机字符串
        const outputFileName = `output_${randomString}.wav`;
        const outputFilePath = path.join(Constant.CACHES_PATH, outputFileName);

        // 保存并发送 WAV 文件
        fs.writeFileSync(outputFilePath, wavBuffer);

        await session.sendQueued(h('file', {
          src: `file://${outputFilePath}`,
          title: outputFileName,
        }));

        // 删除临时文件
        fs.unlinkSync(outputFilePath);
      } catch (error) {
        OtomadHelper.INSTANCE.pluginLogger.error('合成失败:');
        OtomadHelper.INSTANCE.pluginLogger.error(error);
        await session.sendQueued('合成失败，请稍后重试。');
      }
    });

  protected async getAudio(
    midiSrc: string,
    sampleSrc: string
  ): Promise<Buffer> {
    const api = "http://localhost:8099/otmc";

    const formData = new FormData();
    formData.append("midi", midiSrc);
    formData.append("sample", sampleSrc);

    const response = await axios.post(api, formData, {
      responseType: 'arraybuffer',
    });

    return response.data;
  }


  public static get(): CommandProvider {
    return new this().root;
  }
}
