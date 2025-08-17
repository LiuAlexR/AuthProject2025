use serde::Deserialize;

#[derive(Deserialize)]
pub struct User {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct UserWithKey { //not in use
    pub username: String,
    pub secret_key: String,
}
#[derive(Deserialize)]
pub struct UserRequest { //not in use
    pub username: String,
    pub password: String,
    pub jwt: String,
}
#[derive(Deserialize)]
pub struct MFARequest {
    pub jwt: String,
    pub password: String,
}
