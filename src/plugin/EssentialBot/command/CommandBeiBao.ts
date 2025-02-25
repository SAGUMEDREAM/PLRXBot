import {CommandProvider} from "../../../core/command/CommandProvider";
import path from "path";
import {Constant} from "../../../core/Constant";
import fs from "fs";
import {contextOptional} from "../../../index";
import {Messages} from "../../../core/network/Messages";

const outdent = require('outdent');

export class CommandBeiBao {
  public root = new CommandProvider()
    .addRequiredArgument("文本", "text")
    .onExecute(async (session, args) => {
      const text = args.getArgumentsString();
      const img: Buffer = fs.readFileSync(path.resolve(Constant.ASSETS_PATH, `beibao.jpg`));
      const result = await contextOptional.get()["puppeteer"]["render"](
        html({
          text,
          fontFamily: '"HarmonyOS Sans SC", "Source Han Sans CN", sans-serif',
          fontColor: '#000500',
          strokeColor: '#c6c6c6',
          maxFontSize: 90,
          minFontSize: 38,
          offsetWidth: 900,
          img,
          importCSS: 'https://gitee.com/ifrank/harmonyos-fonts/raw/main/css/harmonyos_sans_sc.css'
        })
      );
      await Messages.sendMessageToReply(session, result);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}

export function html(params: {
  text: string,
  fontFamily: string,
  fontColor: string,
  strokeColor: string,
  maxFontSize: number,
  minFontSize: number,
  offsetWidth: number,
  img: Buffer,
  importCSS: string
}) {
  const text = escapeHTML(params.text).replaceAll('\n', '<br/>')
  return outdent`
  <head>
    <style>
      @import url('${params.importCSS}');
      body {
        width: 960px;
        height: 768px;
        padding: 0 32;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin: 0;
        font-weight: 900;
        font-family: ${params.fontFamily};
        color: ${params.fontColor};
        -webkit-text-stroke: 2.5px ${params.strokeColor};
        background-image: url(data:image/png;base64,${params.img.toString('base64')});
        background-repeat: no-repeat;
      }
    </style>
  </head>
  <body>
    <div>${text}</div>
  </body>
  <script>
    const dom = document.querySelector('body')
    const div = dom.querySelector('div')
    let fontSize = ${params.maxFontSize}
    dom.style.fontSize = fontSize + 'px'
    while (div.offsetWidth >= ${params.offsetWidth} && fontSize > ${params.minFontSize}) {
      dom.style.fontSize = --fontSize + 'px'
    }
  </script>`
}

export function escapeHTML(str: string) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\'': '&#39;',
    '"': '&quot;'
  }[tag] ?? tag))
}
