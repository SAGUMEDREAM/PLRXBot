import {UserProfile} from "../../../core/user/UserProfile";
import {CustomDataInstance} from "../../../core/data/CustomDataInstance";

export class ecoObj {
  public balance: number = 0;
}

export class EcoSystem extends CustomDataInstance {
  private userProfile: UserProfile;
  public ecoObj: ecoObj;
  public init() {
    this.ecoObj = this.userProfile.profile.data["eco_system"];
  }
  public save() {
    this.userProfile.profile.data["eco_system"] = this.ecoObj;
  };

  constructor(userProfile: UserProfile) {
    super(userProfile);
    this.userProfile = userProfile;
    this.init();
  }

  public static getSystem(userProfile: UserProfile): EcoSystem {
    return userProfile["INSTANCE_ECO"];
  }

}
