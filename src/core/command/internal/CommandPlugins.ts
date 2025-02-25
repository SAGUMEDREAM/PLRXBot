import {CommandProvider} from "../CommandProvider";
import {Messages} from "../../network/Messages";
import {Plugins} from "../../plugins/Plugins";

export class CommandPlugins {
  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(1))
    .onExecute(async (session, args) => {
      const mdList = [
        `## 插件列表\n`,
      ]
      mdList.push(`一共${Plugins.getPlugins().size}个插件：\n`)
      Plugins.getPlugins().forEach((plugin, key) => mdList.push(`* ${plugin?.pluginConfig?.name || plugin.plugin_id}\n`))

      await Messages.sendMessageToReply(session, await Messages.markdown(mdList));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
