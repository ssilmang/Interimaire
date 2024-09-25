export interface IUsers {
  userOne: string;
  userlog:string;
}
export interface IAuth {
  signup: string;
}
export class Images {
  public static readonly mainLogo: string = './assets/images/logo/my-logo.png';
  public static readonly bannerLogo: string = './assets/images/logo/login.png';
  public static readonly LOGO: string = './assets/images/logo/Image1.jpg';
  public static readonly Orange: string = './assets/images/logo/ORANGE.png';
  public static readonly sonatel: string = './assets/images/logo/loginn.png';

  public static readonly auth: IAuth = {
    signup: './assets/images/authpage/signup.jpg',
  };
  public static readonly users: IUsers = {
    userOne: './assets/authpage/massar.jpg',
    userlog: './assets/authpage/Image1.jpg',
  };
}
