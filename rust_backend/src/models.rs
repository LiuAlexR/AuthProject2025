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
