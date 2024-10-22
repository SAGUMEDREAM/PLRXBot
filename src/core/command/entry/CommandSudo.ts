import {CommandProvider} from "../CommandProvider";
import {UserManager} from "../../user/UserManager";
import {Messages} from "../../network/Messages";
import {CommandHelper} from "../CommandHelper";
import {Utils} from "../../utils/Utils";
import {UserProfile} from "../../user/UserProfile";
import {Files} from "../../utils/Files";
import fs from "fs";
import path from "path";
import {Constant} from "../../Constant";

export class CommandSudo {
  public readonly edit_permission_level = new CommandProvider()
    .addArg("目标")
    .addArg("权限等级")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      const level = args.get(1);
      if(target == null && level == null) {
        CommandProvider.leakArgs(session,args);
        return;
      }
      const user = UserManager.get(target);
      if(user) {
        user.profile.permission_level = Number(level);
        user.save();
        Messages.sendMessageToReply(session,`已将 ${target} 的用户权限等级设置为 ${level}`)
      } else {
        Messages.sendMessageToReply(session,"用户不存在");
      }
    })
  ;
  public readonly permission_add = new CommandProvider()
    .addArg("目标")
    .addArg("权限名")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      const perm_name = args.get(1);
      if(target == null && perm_name == null) {
        CommandProvider.leakArgs(session,args);
        return;
      }
      const user = UserManager.get(target);
      if(user) {
        if(user.profile.permissions.includes(perm_name)) {
          Messages.sendMessageToReply(session,`用户 ${target} 已经拥有权限 ${perm_name}`)
        } else {
          user.profile.permissions.push(perm_name);
          user.save();
          Messages.sendMessageToReply(session,`已为用户 ${target} 添加权限 ${perm_name}`)
        }
      } else {
        Messages.sendMessageToReply(session,"用户不存在");
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
          +`用户ID: ${user.getProfile().user_id}\n`
          +`封禁状态: ${user.getProfile().banned?"是":"否"}\n`
          +`权限等级:${user.getProfile().permission_level}\n`
          +"数据: "
        const result1 = JSON.stringify(data);
        const results = result0+result1;
        Messages.sendMessageToReply(session, results);
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    })
  ;
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
    })
  ;
  public readonly view = new CommandProvider()
    .addSubCommand("profile",this.view_profile)
    .addSubCommand("permission",this.view_permission)
    .addSubCommand("permission_level",this.view_permission_level)
  ;
  public readonly edit = new CommandProvider()
    .addSubCommand("profile",this.edit_profile)
    .addSubCommand("permission",this.edit_permission)
    .addSubCommand("permission_level",this.edit_permission_level)
  ;
  public readonly ban = new CommandProvider()
    .addArg("目标")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      if (target == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const user = UserManager.get(target);
      if(user) {
        user.profile.banned = true;
        user.save()
        Messages.sendMessageToReply(session, `已封禁用户 ${target}`);
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    })
  ;
  public readonly pardon = new CommandProvider()
    .addArg("目标")
    .onExecute((session, args) => {
      const target = args.getUserId(0);
      if (target == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const user = UserManager.get(target);
      if(user) {
        user.profile.banned = false;
        user.save()
        Messages.sendMessageToReply(session, `已解封用户 ${target}`);
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    })
  ;
  public readonly datafix = new CommandProvider()
    .onExecute((session, args) => {
      const userDataPath: string = UserManager.getUserDataPath();
      let files = Files.getDir(userDataPath);
      let result = [];
      let jsonFiles = files.filter(file => path.extname(file) === '.json');
      let message = "数据修复成功";
      jsonFiles.forEach(file => {
        try {
          const data = Files.read(file);
          JSON.parse(data);
        } catch (error) {
          Files.delete(file);
          result.push(file);
        }
      });
      files = Files.getDir(userDataPath);
      files.forEach((file: string) => {
        const user_id = Files.getFileName(file);
        const user: UserProfile = new UserProfile(file);
        let userMap: Map<number | string, UserProfile> = new Map<number | string, UserProfile>();
        userMap.set(user_id, user);
        user.dataFixer();
        user.save();
        userMap.delete(user_id);
        userMap = null;
      });
      result.forEach((file) => {
        message += `\n删除的错误文件: ${file}`;
      })
      Messages.sendMessageToReply(session, message);
    })
  ;
  public readonly test_user_data = new CommandProvider()
    .onExecute((session, args) => {
      const directory = Constant.USER_DATA_PATH;
      const files = Files.getDir(directory);
      let result = "";
      const jsonFiles = files.filter(file => path.extname(file) === '.json');
      result += "错误文件:\n";
      jsonFiles.forEach(file => {
        try {
          const data = Files.read(file);
          JSON.parse(data);
        } catch (error) {
          result += `${file}\n`;
        }
      });
      Messages.sendMessageToReply(session,result)
    })
  ;
  public readonly user = new CommandProvider()
    .onExecute(CommandProvider.leakArgs)
    .addSubCommand("edit",this.edit)
    .addSubCommand("view",this.view)
    .addSubCommand("ban",this.ban)
    .addSubCommand("pardon",this.pardon)
    .addSubCommand("datafix",this.datafix)
    .addSubCommand("test",this.test_user_data)
  ;
  public readonly tree = new CommandProvider()
    .onExecute((session, args) => {
      const c = Utils.sliceArrayFrom(args.all(),0).toString();
      if (c == null || c == "") {
        CommandProvider.leakArgs(session, args);
        return;
      }
      Messages.sendMessageToReply(session,`${JSON.stringify(CommandHelper.parseCommand(c),null,2)}`);
    })
  ;
  public readonly root = new CommandProvider()
    .onExecute(CommandProvider.leakArgs)
    .requires(session => session.hasPermissionLevel(4))
    .addSubCommand("user",this.user)
    .addSubCommand("tree",this.tree)
  ;
  public static get(): CommandProvider{
    return new this().root;
  }
}
