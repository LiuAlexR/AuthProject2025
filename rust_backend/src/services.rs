use crate::helpers::database_interface::*;
use crate::helpers::math::*;
use crate::models::*;
use actix_web::Error;
use std::time::{SystemTime, UNIX_EPOCH};

pub async fn register_user_service(user_data: User) -> String {
    //TODO
    let secret_key: String = create_secret_key();
    let _ = create_new_user(&user_data.username, &user_data.password, &secret_key).await;

    return secret_key;
}

pub async fn get_totp_codes_service(user_id: i32) -> Result<Vec<u32>, Error> {
    let doc = get_secret_key_typed(user_id)
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    let key = doc
        .get_str("2fa_key")
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    let current_secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|_| actix_web::error::ErrorInternalServerError("System time error"))?
        .as_secs();

    let current_time_step = current_secs / 30;
    let mut codes = Vec::new();

    // Generate codes for previous, current, and next time windows
    for offset in -1..=1i64 {
        let step = (current_time_step as i64 + offset) as u64;
        if let Ok(code) = create_one_time_password(step * 30, key) {
            codes.push(code);
        }
    }

    if codes.is_empty() {
        return Err(actix_web::error::ErrorInternalServerError(
            "Failed to generate TOTP codes",
        ));
    }

    Ok(codes)
}
