export interface IUsers {
  userOne: string;
}
export interface IAuth {
  signup: string;
}
export interface Image{
  img:string
}
export class Images {
  public static readonly mainLogo: string = './assets/images/logo/loginn.png';
  public static readonly bannerLogo: string = './assets/images/logo/sonatel.png';
  public static readonly bannerRH: string = './assets/images/logo/login.png';
  public static readonly photoLog:string =  './assets/images/logo/Image1.jpg';
  public static readonly auth: IAuth = {
    signup: './assets/images/authpage/signup.jpg',
  };

  public static readonly users: IUsers = {
    userOne: './assets/images/authpage/profile-image.jpg',

  };
  public static readonly photo: Image = {
    img: './assets/images/authpage/massar.jpg',
  };
}
