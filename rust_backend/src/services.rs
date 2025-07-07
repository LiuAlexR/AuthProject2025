use crate::helpers::database_interface::*;
use crate::helpers::math::*;
use crate::models::*;

pub async fn register_user(userData: User) -> String {
    let password = hash(&userData.password);
    let _ = create_new_user(&userData.username, &password).await;

    let s = create_secret_key();
    add_secret_key(&userData.username, &s).await;

    return s;
}
