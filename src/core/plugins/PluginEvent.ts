export enum PluginEvent {
  HANDLE_MESSAGE,             // 接收消息
  HANDLE_MESSAGE_BEFORE,      // 接收消息之前
  HANDLE_MESSAGE_AFTER,       // 接收消息之后
  LOADING_PROFILE,            // 加载用户数据
  LOADING_GROUP_DATA,         // 加载群组数据
  SAVING_PROFILE,             // 保存用户数据
  SAVING_GROUP_DATA,          // 保存群组数据
  REQUEST_FRIEND,             // 收到申请好友
  INVITED_TO_GROUP,           // 收到邀请加群
  BOT_JOIN_GROUP,             // 机器人账号加入群组
  MEMBER_JOIN_GROUP,         // 新成员加入群组
  MEMBER_REQUEST_JOIN_GROUP, // 收到加群请求
  PLUGIN_ENABLED,            // 插件加载
  PLUGIN_DISABLED,           // 插件卸载
}
