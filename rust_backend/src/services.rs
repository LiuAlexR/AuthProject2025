use crate::helpers::database_interface::*;
use crate::helpers::math::*;
use crate::models::*;

pub async fn register_user(userData: User) {
    let password = hash(&userData.password);
    let _ = create_new_user(&userData.username, &password).await;
}
