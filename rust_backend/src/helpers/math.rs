use bcrypt;
use hex_literal::hex;
use hmac::{Hmac, Mac};
use sha2::Sha256;
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

pub fn create_one_time_password(password: &str, key: &str) -> u32 {
    type HmacSha256 = Hmac<Sha256>;

    let mut mac = HmacSha256::new_from_slice(key.as_bytes()).expect("idk");
    mac.update(password.as_bytes());

    let result = mac.finalize();
    let code_bytes = result.into_bytes();

    let s: String = code_bytes.iter().map(|n| n.to_string()).collect();
    let code: &u32 = &s[1..6].parse().unwrap();

    println!("{}", s);
    println!("{}", code);

    return *code;
}
