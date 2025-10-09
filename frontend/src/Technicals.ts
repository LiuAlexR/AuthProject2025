export enum JavaServer {
  PORT = "http://localhost:8080",
  WEB_SERVER = "/Webserver",
  GET_LOCATION = "/getLocation",
  REGISTER = "/register_user",
  GET_CODE = "/get_codes",
  GET_OTHERS_LOCATIONS = "/get",
}

export enum RustServer {
  PORT = "http://localhost:8081",
  LOGIN_2FA = "/verify_login_2fa",
  LOGIN = "/verify_login",
  REGISTER = "/register_user",
}

export enum QR {
  VENDOR = "Srikar and Alex's amazing App",
}

export interface UserFetchRequestModel {
  user_id: number;
  jwt: String;
  fetchableIDs: number[];
}

export interface UserExposed {
  user_id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  timeOfEventMS: number;
}
