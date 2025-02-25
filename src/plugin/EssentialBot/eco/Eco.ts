import {UserInfo} from "../../../core/user/UserInfo";
import {CustomDataInstance} from "../../../core/data/CustomDataInstance";

export class ecoObj {
  public balance: number = 0;
}

export class EcoSystem extends CustomDataInstance {
  private userInfo: UserInfo;
  public ecoObj: ecoObj;
  public init() {
    this.ecoObj = this.userInfo.profile.data["eco_system"];
  }
  public save() {
    this.userInfo.profile.data["eco_system"] = this.ecoObj;
  };

  constructor(userInfo: UserInfo) {
    super(userInfo);
    this.userInfo = userInfo;
    this.init();
  }

  public static getSystem(userProfile: UserInfo): EcoSystem {
    return userProfile["INSTANCE_ECO"];
  }

}
