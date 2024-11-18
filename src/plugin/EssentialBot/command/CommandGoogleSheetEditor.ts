import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import { SheetYears } from "../sheets/SheetYears";
import fetch from "node-fetch";
import { SheetEvent } from "../sheets/SheetEvent";
import { SheetRegion } from "../sheets/SheetRegion";
import {google} from "googleapis";
import {Constant} from "../../../core/Constant";
import path from "path";
import {Utils} from "../../../core/utils/Utils";
import { HttpProxyAgent } from 'http-proxy-agent';

export const SHEET_URL: string = 'https://thonly.cc/proxy_google_doc/v4/spreadsheets/';
export const KEY: string = "AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw";

const proxyUrl = 'http://127.0.0.1:7899'; // 代理服务器地址
const agent = new HttpProxyAgent(proxyUrl); // 使用 HttpsProxyAgent 配置代理
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SERVICE_ACCOUNT_PATH = path.join(Utils.getRoot(), 'data', 'service_account.json');  // 指定服务账户 JSON 文件路径


export class CommandGoogleSheetEditor {
  public root = new CommandProvider()
    .requires(session => session.hasPermissionLevel(2))
    .addSubCommand("新增", this.addNewEventCommand())
    .addSubCommand("修改", this.modifyEventCommand())
    .addSubCommand("删除", this.deleteEventCommand());

  private addNewEventCommand() {
    return new CommandProvider()
      .addArg("类型")
      .addArg("活动名称")
      .addArg("地区")
      .addArg("日期")
      .addArg("QQ群")
      .addArg("状态")
      .onExecute(async (session, args) => {
        if (args.size() < 6) {
          Messages.sendMessageToReply(session, "参数缺失");
          return;
        }

        const [type, name, region, date, group_id, status] = args.all();
        const year = new Date(Date.now()).getFullYear();

        // 年份验证
        if (date !== "暂无") {
          const yearMatch = date.match(/^(\d{4})\//);
          if (!yearMatch || !SheetYears.isValidYear(yearMatch[1])) {
            Messages.sendMessageToReply(session, "年份输入有误或不存在该年份");
            return;
          }
        }

        if (!SheetRegion.isValidRegion(region)) {
          Messages.sendMessageToReply(session, "不存在该地区");
          return;
        }

        const spreadsheetId: string = SheetYears.getYearSpreadsheetId(String(year)).spreadsheetId;
        const API_ADDRESS = `${SHEET_URL}/${spreadsheetId}/values:batchGet?ranges=${SheetEvent.getEvent(type)}!A2:E200&key=${KEY}`;
        const insertedObj = [status, name, region, date, group_id];

        try {
          const response = await fetch(API_ADDRESS);
          const data = await response.json();
          const insertLocation = await this.getInsertLocation(data, date);

          if (insertLocation === -1) {
            Messages.sendMessageToReply(session, "未找到合适的插入位置");
            return;
          }

          await this.insertNewEvent(type,spreadsheetId, insertLocation, insertedObj);
          Messages.sendMessageToReply(session, "成功插入数据");
        } catch (error) {
          console.error(error);
          Messages.sendMessageToReply(session, "插入数据失败");
        }
      });
  }

  private async getInsertLocation(data: any, date: string): Promise<number> {
    let insertLocation = 1;
    const dateNum = Date.parse(date);
    const valueRanges = data["valueRanges"];

    for (const range of valueRanges) {
      for (const [index, eventObj] of range.values.entries()) {
        const eventDateNum = Date.parse(eventObj[3]);
        insertLocation++;
        if (dateNum <= eventDateNum) {
          return insertLocation;
        }
      }
    }

    return -1;  // 如果没有找到合适的插入位置
  }

  // 获取认证客户端并配置代理
  async getAuthClient() {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_PATH,  // 服务账户的 JSON 文件路径
      scopes: SCOPES,  // 设置权限范围
    });

    // 使用代理配置，创建 gaxios 客户端
    const client = await auth.getClient();

    // 配置 `gaxios` 使用代理
    client["_httpRequest"] = (url, options) => {
      const requestOptions = {
        ...options,
        agent,  // 配置代理
      };
      return fetch(url, requestOptions);
    };

    return client;
  }

  private async insertNewEvent(type: string,spreadsheetId: string, insertLocation: number, insertedObj: any[]) {
    const authClient = await this.getAuthClient();

    const body = {
      range: `${SheetEvent.getEvent(type)}!A${insertLocation}:E${insertLocation}`,
      majorDimension: "ROWS",
      values: [insertedObj],
    };

    const appendResponse = await fetch(`${SHEET_URL}/${spreadsheetId}/values/Sheet1!A${insertLocation}:E${insertLocation}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&key=${KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await authClient.getAccessToken()}`,  // 使用获取的访问令牌
      },
      body: JSON.stringify(body),
      agent
    });

    if (!appendResponse.ok) {
      throw new Error(`插入数据失败: ${appendResponse.statusText}`);
    }

    return appendResponse.json();
  }

  private modifyEventCommand() {
    return new CommandProvider()
      .addArg("活动名称")
      .addArg("地区/日期/QQ群/状态")
      .addArg("值")
      .onExecute(async (session, args) => {
        if (args.size() < 3) {
          Messages.sendMessageToReply(session, "参数缺失");
          return;
        }

        const [name, type, value] = args.all();
        const updated = await this.modifyEvent(name, type, value);

        if (!updated) {
          Messages.sendMessageToReply(session, "修改失败");
        } else {
          Messages.sendMessageToReply(session, "修改成功");
        }
      });
  }

  private async modifyEvent(name: string, type: string, value: string): Promise<boolean> {
    let completed = false;
    const pointer = { sheet_year: null, sheet_id: null, index: null };

    for (const url of SheetYears.thonly_sheets_api) {
      const response = await fetch(url);
      const data = await response.json();
      const valueRanges = data["valueRanges"];
      if (completed) break;

      for (const [index0, sheetObj] of valueRanges.entries()) {
        const values = sheetObj.values;
        for (const [index1, eventObj] of values.entries()) {
          if (name.toLowerCase() === eventObj[1].toString().toLowerCase()) {
            pointer.sheet_year = eventObj[3].match(/^(\d{4})\//);
            pointer.sheet_id = ['THO', 'THP&tea-party', 'School', 'LIVE'][index0] || null;
            pointer.index = 1 + index1;
            completed = true;
            break;
          }
        }
      }
    }

    if (!completed) {
      return false;
    }

    let range = '';
    switch (type) {
      case "地区": {
        if (!SheetRegion.isValidRegion(value)) {
          return false;
        }
        range = 'C';
        break;
      }
      case "日期": {
        range = 'D';
        break;
      }
      case "QQ群": {
        range = 'E';
        break;
      }
      case "状态": {
        range = 'A';
        break;
      }
      default: {
        return false;
      }
    }

    // 在此处理修改逻辑
    await this.updateEvent(pointer.sheet_id, pointer.sheet_year, pointer.index, range, value);
    return true;
  }

  private async updateEvent(sheetId: string, sheetYear: string | null, index: number | null, range: string, value: string) {
    if (!sheetId || sheetYear === null || index === null) {
      return;
    }

    const updateBody = {
      range: `${sheetId}!${range}${index}`,
      majorDimension: "ROWS",
      values: [[value]],
    };

    const updateResponse = await fetch(`${SHEET_URL}/${sheetYear}/values/${sheetId}!${range}${index}?valueInputOption=RAW&key=${KEY}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateBody),
    });

    if (!updateResponse.ok) {
      throw new Error(`更新失败: ${updateResponse.statusText}`);
    }

    return updateResponse.json();
  }

  private deleteEventCommand() {
    return new CommandProvider()
      .addArg("活动名称")
      .onExecute(async (session, args) => {
        if (args.size() < 1) {
          Messages.sendMessageToReply(session, "参数缺失");
          return;
        }

        const name = args.getString(0);
        const deleted = await this.deleteEvent(name);

        if (!deleted) {
          Messages.sendMessageToReply(session, "删除失败");
        } else {
          Messages.sendMessageToReply(session, "删除成功");
        }
      });
  }

  private async deleteEvent(name: string): Promise<boolean> {
    let completed = false;
    const pointer = { sheet_year: null, sheet_id: null, index: null };

    for (const url of SheetYears.thonly_sheets_api) {
      const response = await fetch(url);
      const data = await response.json();
      const valueRanges = data["valueRanges"];
      if (completed) break;

      for (const [index0, sheetObj] of valueRanges.entries()) {
        const values = sheetObj.values;
        for (const [index1, eventObj] of values.entries()) {
          if (name.toLowerCase() === eventObj[1].toString().toLowerCase()) {
            pointer.sheet_year = eventObj[3].match(/^(\d{4})\//);
            pointer.sheet_id = ['THO', 'THP&tea-party', 'School', 'LIVE'][index0] || null;
            pointer.index = 1 + index1;
            completed = true;
            break;
          }
        }
      }
    }

    if (!completed) {
      return false;
    }

    await this.deleteEventFromSheet(pointer.sheet_id, pointer.sheet_year, pointer.index);
    return true;
  }

  private async deleteEventFromSheet(sheetId: string, sheetYear: string | null, index: number | null) {
    if (!sheetId || sheetYear === null || index === null) {
      return;
    }

    const deleteBody = {
      range: `${sheetId}!A${index}:E${index}`,
      majorDimension: "ROWS",
      values: [["DELETED"]],
    };

    const deleteResponse = await fetch(`${SHEET_URL}/${sheetYear}/values/${sheetId}!A${index}:E${index}?key=${KEY}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deleteBody),
    });

    if (!deleteResponse.ok) {
      throw new Error(`删除失败: ${deleteResponse.statusText}`);
    }

    return deleteResponse.json();
  }

  public static get(): CommandProvider {
    return new this().root;
  }
}
