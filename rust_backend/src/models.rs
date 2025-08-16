use serde::Deserialize;

#[derive(Deserialize)]
pub struct User {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct UserWithKey {
    pub username: String,
    pub secret_key: String,
}
#[derive(Deserialize)]
pub struct UserRequest {
    pub username: String,
    pub password: String,
    pub jwt: String,
}
#[derive(Deserialize)]
pub struct MFARequest {
    pub username: String,
    pub password: String,
}
