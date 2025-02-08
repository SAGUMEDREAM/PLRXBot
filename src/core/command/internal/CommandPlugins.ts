import {CommandProvider} from "../CommandProvider";
import {Messages} from "../../network/Messages";
import {Plugins} from "../../plugins/Plugins";

export class CommandPlugins {
  public readonly root = new CommandProvider()
    .requires(session => session.hasPermissionLevel(2))
    .onExecute(async (session, args) => {
      const mdList = [
        `## 插件列表\n`,
      ]
      mdList.push(`一共${Plugins.getPlugins().size}个插件：\n`)
      Plugins.getPlugins().forEach((plugin, key) => mdList.push(`* ${plugin?.pluginConfig?.name || plugin.plugin_id}\n`))

      Messages.sendMessageToReply(session, await Messages.getMarkdown(mdList));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
