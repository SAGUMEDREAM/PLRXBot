import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import axios from "axios";
import FormData from "form-data";
import { h } from "koishi";

export class CommandHuoZi {
  public root = new CommandProvider()
    .addRequiredArgument("文本", "text")
    // .requires(session => session.hasPermissionLevel(2))
    .onExecute(async (session, args) => {
      const texts = args.getArgumentsString();
      const api = "http://localhost:8099/huozi";

      const formData = new FormData();
      for (const text of texts) {
        formData.append("texts", text);
      }

      try {
        const res = await axios.post(api, formData, {
          headers: formData.getHeaders(),
          responseType: "arraybuffer",
        });

        const buffer = Buffer.from(res.data);
        await Messages.sendMessage(session, h.audio(buffer, "audio/wav"));
      } catch (error) {
        await Messages.sendMessage(session, "请求失败，请稍后再试。");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
