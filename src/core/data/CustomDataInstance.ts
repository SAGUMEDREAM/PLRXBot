import {UserProfile} from "../user/UserProfile";

export abstract class CustomDataInstance {
  public instance_data_id: string;
  protected constructor(userProfile: UserProfile) {
  }
  public abstract init(): void;
  public abstract save(): void;
}
