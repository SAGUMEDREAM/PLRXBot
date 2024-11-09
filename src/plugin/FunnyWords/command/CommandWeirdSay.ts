import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {FunnyWords} from "../index";

export class CommandWeirdSay {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let keyword = args.get(0);
      if(keyword == null) {
        Messages.sendMessageToReply(session,"参数缺失");
        return;
      }
      (async () => {
        let result = this.generateWeirdSentence(keyword);
        Messages.sendMessageToReply(session,result);
      })();
    })
    .addArg("关键词");

  private generateWeirdSentence(keyword: string): string {
    let relatedWords = this.findRelatedWords(keyword);

    const randomSubjects = this.getRandomWords(FunnyWords.CACHE.subject, 2);
    const randomPredicates = this.getRandomWords(FunnyWords.CACHE.predicate, 2);
    const randomObjects = this.getRandomWords(FunnyWords.CACHE.object, 2);

    const adjectives = [
      '优雅', '可爱', '聪明', '慈爱', '高尚', '英勇', '正直', '开朗',
      '富有魅力', '有智慧', '乐观', '温暖', '有爱心', '真诚', '富有同情心',
      '杰出', '强大', '成熟', '令人愉悦', '稳重', '和谐', '令人舒适',
      '低级', '丑陋', '无耻', '懦弱', '狭隘', '冷漠', '虚伪', '傲慢',
      '讨厌', '恶心', '不堪', '吵闹', '恶毒', '荒谬', '恶劣', '乏味',
      '自私', '不讲理', '沉闷', '虚假', '愚蠢', '肮脏', '脆弱',
      '聪明', '机智', '朴实', '简洁', '理智', '有条理', '诚实', '清新',
      '安静', '可靠', '真诚', '温暖', '有礼貌', '有责任心', '冷静',
      '离奇', '神秘', '不可理喻', '无法理解', '荒诞', '不可思议', '诡异',
      '奇怪', '让人疑惑', '诡谲', '异想天开', '古怪', '梦幻', '怪异',
      '颠覆常理', '无法归类', '不按常理出牌', '出奇不意', '神奇'
    ];

    const adverbs = [
      '优雅地', '聪明地', '温柔地', '愉快地', '高兴地', '积极地', '冷静地', '坚定地',
      '善意地', '慷慨地', '亲切地', '充满希望地', '热情地', '坚定不移地', '认真',
      '恶劣地', '傲慢地', '愚蠢地', '粗暴地', '恶心地', '懒散地', '狭隘地', '吵闹地',
      '迟缓地', '愚笨地', '冷漠地', '不耐烦地', '恼火地', '自私地', '无聊地',
      '轻轻地', '慢慢地', '专心地', '平静地', '小心地', '愉快地', '自然地', '稳重地',
      '偶尔地', '坚定地', '温暖地', '顺畅地', '安静地', '小心翼翼地', '认真地',
      '突然地', '疯狂地', '奇怪地', '莫名其妙地', '异乎寻常地', '古怪地', '不合常理地',
      '不经意地', '出其不意地', '超乎想象地', '不可理喻地', '离奇地', '诡异地', '不可理解地',
      '无意识地', '反常地', '疯狂地', '令人困惑地'
    ];

    const randomAdjective = Math.random() < 0.5 ? adjectives[Math.floor(Math.random() * adjectives.length)] : '';
    const randomAdverb = Math.random() < 0.5 ? adverbs[Math.floor(Math.random() * adverbs.length)] : '';

    const sentencePattern = Math.random() < 0.5 ? 'SVO' : 'SVOA';

    let sentenceParts: string[] = [];

    if (sentencePattern === 'SVO') {
      sentenceParts.push(randomSubjects[0]);
      sentenceParts.push(randomPredicates[0]);
      sentenceParts.push(keyword);
      sentenceParts.push(randomObjects[0]);
    } else {
      sentenceParts.push(randomSubjects[0]);
      sentenceParts.push(randomPredicates[0]);
      sentenceParts.push(keyword);
      sentenceParts.push(randomObjects[0]);
      if (randomAdverb) {
        const adverbPosition = Math.floor(Math.random() * 4);
        sentenceParts.splice(adverbPosition, 0, randomAdverb);
      }
    }

    if (randomAdjective) sentenceParts.push(randomAdjective);

    sentenceParts = Array.from(new Set(sentenceParts));

    let sentence = sentenceParts.join('');
    const maxLength = 80;

    if (sentence.length > maxLength) {
      sentence = sentence.slice(0, maxLength);
    }

    const endPunctuation = this.getRandomEndingPunctuation();
    sentence += endPunctuation;

    return sentence;
  }

  private findRelatedWords(keyword: string): string[] {
    let relatedWords: string[] = [];

    for (let wordType of ['subject', 'predicate', 'object']) {
      let wordsArray = FunnyWords.CACHE[wordType];
      if (wordsArray.includes(keyword)) {
        relatedWords = this.extractRelatedWords(wordsArray, keyword);
        break;
      }
      let keywordParts = this.splitKeyword(keyword);
      for (let part of keywordParts) {
        if (wordsArray.includes(part)) {
          relatedWords = this.extractRelatedWords(wordsArray, part);
          break;
        }
      }
      if (relatedWords.length > 0) break;
    }

    return relatedWords;
  }

  private extractRelatedWords(wordsArray: string[], keyword: string): string[] {
    const index = wordsArray.indexOf(keyword);
    const range = 15;
    const start = Math.max(index - range, 0);
    const end = Math.min(index + range, wordsArray.length - 1);
    return wordsArray.slice(start, end + 1);
  }

  private splitKeyword(keyword: string): string[] {
    return keyword.split(/[\s,]+/);
  }

  private getRandomWords(words: string[], count: number): string[] {
    let randomWords = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      randomWords.push(words[randomIndex]);
    }
    return randomWords;
  }

  private getRandomEndingPunctuation(): string {
    const punctuations = ['！', '。', '，', '?'];
    return punctuations[Math.floor(Math.random() * punctuations.length)];
  }

  public static get(): CommandProvider {
    return new this().root;
  }
}
