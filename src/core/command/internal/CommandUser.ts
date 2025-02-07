import {CommandProvider} from "../CommandProvider";
import {Utils} from "../../utils/Utils";
import {Messages} from "../../network/Messages";
import {CommandHelper} from "../CommandHelper";
import {UserManager} from "../../user/UserManager";

export class CommandUser {
  public readonly edit_permission_level = new CommandProvider()
    .addArg("目标")
    .addArg("权限等级")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      const level = args.get(1);
      if (target == null && level == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const user = UserManager.get(target);
      if (user) {
        user.profile.permission_level = Number(level);
        user.save();
        Messages.sendMessageToReply(session, `已将 ${target} 的用户权限等级设置为 ${level}`)
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly permission_add = new CommandProvider()
    .addArg("目标")
    .addArg("权限名")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      const perm_name = args.get(1);
      if (target == null && perm_name == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const user = UserManager.get(target);
      if (user) {
        if (user.profile.permissions.includes(perm_name)) {
          Messages.sendMessageToReply(session, `用户 ${target} 已经拥有权限 ${perm_name}`)
        } else {
          user.profile.permissions.push(perm_name);
          user.save();
          Messages.sendMessageToReply(session, `已为用户 ${target} 添加权限 ${perm_name}`)
        }
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });
  public readonly permission_remove = new CommandProvider()
    .addArg("目标")
    .addArg("权限名")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      const perm_name = args.get(1);
      if (target == null || perm_name == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const user = UserManager.get(target);
      if (user) {
        const permissionIndex = user.profile.permissions.indexOf(perm_name);
        if (permissionIndex === -1) {
          Messages.sendMessageToReply(session, `用户 ${target} 不拥有权限 ${perm_name}`);
        } else {
          user.profile.permissions.splice(permissionIndex, 1);
          user.save();
          Messages.sendMessageToReply(session, `已为用户 ${target} 移除权限 ${perm_name}`);
        }
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly view_profile = new CommandProvider()
    .addArg("目标")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      if (target == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const user = UserManager.get(target);
      if (user) {
        const data = user.getProfile().data;
        const result0 =
          "用户信息:\n"
          + `用户ID: ${user.getProfile().user_id}\n`
          + `封禁状态: ${user.getProfile().banned ? "是" : "否"}\n`
          + `权限等级:${user.getProfile().permission_level}\n`
          + "数据: "
        const result1 = JSON.stringify(data);
        const results = result0 + result1;
        Messages.sendMessageToReply(session, results);
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly edit_profile = new CommandProvider()
    .addArg("目标")
    .addArg("字段")
    .addArg("值")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      const targetDataPath = args.get(1);
      const newValue = args.get(2);

      if (target == null || targetDataPath == null || newValue == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }

      const user = UserManager.get(target);
      if (user) {
        const data = user.getProfile().data;

        const keys = targetDataPath.split('->');
        let current = data;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (current[key] !== undefined) {
            current = current[key];
          } else {
            Messages.sendMessageToReply(session, `路径 "${targetDataPath}" 不存在于用户数据中`);
            return;
          }
        }

        const finalKey = keys[keys.length - 1];
        if (current[finalKey] !== undefined) {
          current[finalKey] = newValue;
          user.save();
          Messages.sendMessageToReply(session, `用户 ${target} 的数据已更新: ${targetDataPath} = ${newValue}`);
        } else {
          Messages.sendMessageToReply(session, `路径 "${targetDataPath}" 的最后一个键 "${finalKey}" 不存在`);
        }
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly edit_permission = new CommandProvider()
    .onExecute(CommandProvider.leakArgs)
    .addSubCommand("add", this.permission_add)
    .addSubCommand("remove", this.permission_remove)
  ;
  public readonly view_permission = new CommandProvider()
    .addArg("目标")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      if (target == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }

      const user = UserManager.get(target);
      if (user) {
        const permissions = user.profile.permissions;
        if (permissions.length > 0) {
          Messages.sendMessageToReply(session, `用户 ${target} 的权限: ${permissions.join(', ')}`);
        } else {
          Messages.sendMessageToReply(session, `用户 ${target} 没有任何权限`);
        }
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly view_permission_level = new CommandProvider()
    .addArg("目标")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      if (target == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }

      const user = UserManager.get(target);
      if (user) {
        const permissionLevel = user.profile.permission_level;
        Messages.sendMessageToReply(session, `用户 ${target} 的权限级别: ${permissionLevel}`);
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly edit = new CommandProvider()
    .addSubCommand("profile", this.edit_profile)
    .addSubCommand("permission", this.edit_permission)
    .addSubCommand("permission_level", this.edit_permission_level);

  public readonly view = new CommandProvider()
    .addSubCommand("profile", this.view_profile)
    .addSubCommand("permission", this.view_permission)
    .addSubCommand("permission_level", this.view_permission_level);

  public readonly ban = new CommandProvider()
    .addArg("目标")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      if (target == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const user = UserManager.get(target);
      if (user) {
        user.profile.banned = true;
        user.save()
        Messages.sendMessageToReply(session, `已封禁用户 ${target}`);
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly pardon = new CommandProvider()
    .addArg("目标")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      if (target == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const user = UserManager.get(target);
      if (user) {
        user.profile.banned = false;
        user.save()
        Messages.sendMessageToReply(session, `已解封用户 ${target}`);
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly root = new CommandProvider()
    .requires(session => session.hasPermissionLevel(4))
    .onExecute(CommandProvider.leakArgs)
    .addSubCommand("edit", this.edit)
    .addSubCommand("view", this.view)
    .addSubCommand("ban", this.ban)
    .addSubCommand("pardon", this.pardon)

  public static get(): CommandProvider {
    return new this().root;
  }
}
