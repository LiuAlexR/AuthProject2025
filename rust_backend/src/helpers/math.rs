use base32;
use bcrypt;
use data_encoding::BASE32;
use hmac::{Hmac, Mac};
use sha1::Sha1;

pub fn hash(password: &str) -> String {
    //Hashes the password
    let the_hash = bcrypt::hash(password, 12);
    match the_hash {
        Ok(t) => t,
        Err(_e) => "error".to_string(),
    }
}
pub fn verify_password(password: &str, hashed_password: &str) -> bool {
    let verified = bcrypt::verify(password, hashed_password);
    verified.unwrap_or_default()
}

pub fn create_one_time_password(
    timestamp: u64,
    key: &str,
) -> Result<u32, Box<dyn std::error::Error>> {
    type HmacSha1 = Hmac<Sha1>;

    let key_bytes = base32::decode(base32::Alphabet::Rfc4648 { padding: true }, key)
        .ok_or("Invalid base32 key")?;

    let time_step = timestamp / 30;

    let mut mac = HmacSha1::new_from_slice(&key_bytes)?;
    mac.update(&time_step.to_be_bytes());
    let result = mac.finalize();
    let code_bytes = result.into_bytes();

    // Dynamic truncation per RFC 4226
    let offset = (code_bytes[code_bytes.len() - 1] & 0x0f) as usize;
    let bin_code = ((u32::from(code_bytes[offset]) & 0x7f) << 24)
        | ((u32::from(code_bytes[offset + 1]) & 0xff) << 16)
        | ((u32::from(code_bytes[offset + 2]) & 0xff) << 8)
        | (u32::from(code_bytes[offset + 3]) & 0xff);

    // 6 digit code
    Ok(bin_code % 1_000_000)
}

pub fn create_secret_key() -> String {
    let test = "LEBRON JAMES";

    BASE32.encode(test.as_bytes())
}
