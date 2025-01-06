export abstract class AbstractYearData {
  abstract spreadsheetId: string;
}
export class SheetYears {
  public static readonly thonly_sheets_api = [
    "https://thonly.cc/proxy_google_doc/v4/spreadsheets/13ykPzw9cKqQVXXEwhCuX_mitQegHdFHjZtGdqT6tlmk/values:batchGet?ranges=THO!A2:E200&ranges=THP%26tea-party!A2:E200&ranges=School!A2:E200&ranges=LIVE!A2:E200&key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw",
    "https://thonly.cc/proxy_google_doc/v4/spreadsheets/1mMUsvTdyz07BtnLbs0WEr5gdvsRkjftnrek_n5HSdNU/values:batchGet?ranges=THO!A2:E200&ranges=THP%26tea-party!A2:E200&ranges=School!A2:E200&ranges=LIVE!A2:E200&key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw"
  ];
  // public static readonly thonly_sheets_api = [
  //   "https://1919818.xyz/proxy_google_doc/v4/spreadsheets/13ykPzw9cKqQVXXEwhCuX_mitQegHdFHjZtGdqT6tlmk/values:batchGet?ranges=THO!A2:E200&ranges=THP%26tea-party!A2:E200&ranges=School!A2:E200&ranges=LIVE!A2:E200&key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw",
  //   "https://1919818.xyz/proxy_google_doc/v4/spreadsheets/1mMUsvTdyz07BtnLbs0WEr5gdvsRkjftnrek_n5HSdNU/values:batchGet?ranges=THO!A2:E200&ranges=THP%26tea-party!A2:E200&ranges=School!A2:E200&ranges=LIVE!A2:E200&key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw"
  // ];
  private static years: Record<string, AbstractYearData> = {
    "2024": {
      spreadsheetId: "13ykPzw9cKqQVXXEwhCuX_mitQegHdFHjZtGdqT6tlmk"
    },
    "2025": {
      spreadsheetId: "1mMUsvTdyz07BtnLbs0WEr5gdvsRkjftnrek_n5HSdNU"
    }
  };
  public static getYearSpreadsheetId(year: string) {
    return this.years[year];
  }
  public static isValidYear(year: string): boolean {
    return this.years[year] != null;
  }
}
