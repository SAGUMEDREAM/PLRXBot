import {CommandProvider} from "../CommandProvider";
import {Start} from "../../Start";
import {Messages} from "../../network/Messages";
import {LOGGER} from "../../../index";
import {Plugins} from "../../plugins/Plugins";

export class CommandPlugins {
  public readonly root = new CommandProvider()
    .requires(session => session.hasPermissionLevel(2))
    .onExecute(async (session, args) => {
      const mdList = [
        `## 插件列表\n`,
      ]
      Plugins.getPlugins().forEach((plugin, key) => mdList.push(`* ${plugin.plugin_id}\n`))
      mdList.push(`一共${Plugins.getPlugins().size}个插件）: `)

      Messages.sendMessageToReply(session, await Messages.getMarkdown(mdList));
    })

  public static get(): CommandProvider {
    return new this().root;
  }
}
