import {UserInfo} from "../user/UserInfo";

export abstract class CustomDataInstance {
  public instance_data_id: string;
  protected constructor(userInfo: UserInfo) {
  }
  public abstract init(): void;
  public abstract save(): void;
}
