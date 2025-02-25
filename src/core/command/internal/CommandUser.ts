import {CommandProvider} from "../CommandProvider";
import {Messages} from "../../network/Messages";
import {UserManager} from "../../user/UserManager";

export class CommandUser {
  public readonly edit_permission_level = new CommandProvider()
    .addRequiredArgument('用户', 'user')
    .addRequiredArgument('权限等级', 'level')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");
      const level = args.get("level");
      const user = await UserManager.getOrCreate(target);
      if (user) {
        user.profile.permission_level = Number(level);
        await user.save();
        await Messages.sendMessageToReply(session, `已将 ${target} 的用户权限等级设置为 ${level}`)
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly permission_add = new CommandProvider()
    .addRequiredArgument('用户', 'user')
    .addRequiredArgument('权限名', 'permission_name')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");
      const perm_name = args.get("permission_name");
      const user = await UserManager.getOrCreate(target);
      if (user) {
        if (user.profile.permissions.includes(perm_name)) {
          await Messages.sendMessageToReply(session, `用户 ${target} 已经拥有权限 ${perm_name}`)
        } else {
          user.profile.permissions.push(perm_name);
          await user.save();
          await Messages.sendMessageToReply(session, `已为用户 ${target} 添加权限 ${perm_name}`)
        }
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    });
  public readonly permission_remove = new CommandProvider()
    .addRequiredArgument('用户', 'user')
    .addRequiredArgument('权限名', 'permission_name')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");
      const perm_name = args.get("permission_name");
      if (target == null || perm_name == null) {
        await CommandProvider.leakArgs(session, args);
        return;
      }
      const user = await UserManager.getOrCreate(target);
      if (user) {
        const permissionIndex = user.profile.permissions.indexOf(perm_name);
        if (permissionIndex === -1) {
          await Messages.sendMessageToReply(session, `用户 ${target} 不拥有权限 ${perm_name}`);
        } else {
          user.profile.permissions.splice(permissionIndex, 1);
          await user.save();
          await Messages.sendMessageToReply(session, `已为用户 ${target} 移除权限 ${perm_name}`);
        }
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly view_profile = new CommandProvider()
    .addRequiredArgument('用户', 'user')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");

      const user = await UserManager.getOrCreate(target);
      if (user) {
        const data = user.getProfile().data;
        const result0 =
          "用户信息:\n"
          + `用户ID: ${user.getProfile().user_id}\n`
          + `封禁状态: ${user.getProfile().banned ? "是" : "否"}\n`
          + `权限等级:${user.getProfile().permission_level}\n`
          + "数据: "
        const result1 = JSON.stringify(data, null, 2);
        const results = result0 + result1;
        await Messages.sendMessageToReply(session, results);
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly edit_profile = new CommandProvider()
    .addRequiredArgument('用户', 'user')
    .addRequiredArgument('字段', 'key')
    .addRequiredArgument('值', 'value')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");
      const targetDataPath = args.get("key");
      const newValue = args.get("value");

      if (target == null || targetDataPath == null || newValue == null) {
        await CommandProvider.leakArgs(session, args);
        return;
      }

      const user = await UserManager.getOrCreate(target);
      if (user) {
        const data = user.getProfile().data;

        const keys = targetDataPath.split('->');
        let current = data;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (current[key] !== undefined) {
            current = current[key];
          } else {
            await Messages.sendMessageToReply(session, `路径 "${targetDataPath}" 不存在于用户数据中`);
            return;
          }
        }

        const finalKey = keys[keys.length - 1];
        if (current[finalKey] !== undefined) {
          current[finalKey] = newValue;
          await user.save();
          await Messages.sendMessageToReply(session, `用户 ${target} 的数据已更新: ${targetDataPath} = ${newValue}`);
        } else {
          await Messages.sendMessageToReply(session, `路径 "${targetDataPath}" 的最后一个键 "${finalKey}" 不存在`);
        }
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly edit_permission = new CommandProvider()
    .onExecute(CommandProvider.leakArgs)
    .addSubCommand("add", this.permission_add)
    .addSubCommand("remove", this.permission_remove)
  ;
  public readonly view_permission = new CommandProvider()
    .addRequiredArgument('用户', 'user')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");

      const user = await UserManager.getOrCreate(target);
      if (user) {
        const permissions = user.profile.permissions;
        if (permissions.length > 0) {
          await Messages.sendMessageToReply(session, `用户 ${target} 的权限: ${permissions.join(', ')}`);
        } else {
          await Messages.sendMessageToReply(session, `用户 ${target} 没有任何权限`);
        }
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly view_permission_level = new CommandProvider()
    .addRequiredArgument('用户', 'user')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");
      if (target == null) {
        await CommandProvider.leakArgs(session, args);
        return;
      }

      const user = await UserManager.getOrCreate(target);
      if (user) {
        const permissionLevel = user.profile.permission_level;
        await Messages.sendMessageToReply(session, `用户 ${target} 的权限级别: ${permissionLevel}`);
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
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
    .addRequiredArgument('用户', 'user')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");

      const user = await UserManager.getOrCreate(target);
      if (user) {
        user.profile.banned = true;
        await user.save()
        await Messages.sendMessageToReply(session, `已封禁用户 ${target}`);
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly pardon = new CommandProvider()
    .addRequiredArgument('用户', 'user')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");

      const user = await  UserManager.getOrCreate(target);
      if (user) {
        user.profile.banned = false;
        await user.save()
        await Messages.sendMessageToReply(session, `已解封用户 ${target}`);
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(4))
    .onExecute(CommandProvider.leakArgs)
    .addSubCommand("edit", this.edit)
    .addSubCommand("view", this.view)
    .addSubCommand("ban", this.ban)
    .addSubCommand("pardon", this.pardon)

  public static get(): CommandProvider {
    return new this().root;
  }
}
