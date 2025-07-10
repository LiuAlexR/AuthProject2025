use base32;
use bcrypt;
use data_encoding::BASE32;
use hmac::{Hmac, Mac};
use sha1::{ Sha1};
use sha2::Sha256;
use base64::{engine::general_purpose::URL_SAFE, Engine as _};

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

    //This is just decoding our key into bytes
    let key_bytes = base32::decode(base32::Alphabet::Rfc4648 { padding: true }, key)
        .ok_or("Invalid base32 key")?;

    //This gives us our 30 second time block to input into the algorithm
    let time_step = timestamp / 30;

    //This code is just the algorithm creating 20 bytes
    let mut mac = HmacSha1::new_from_slice(&key_bytes)?;
    mac.update(&time_step.to_be_bytes());
    let result = mac.finalize();
    let code_bytes = result.into_bytes();

    //The offset is derived from the last 4 bits of the last byte
    //The reason being is that a) it ensures some sort of randomeness which always helps security
    //and b) 4 bits have a range of 0-15. The MAC has 20 bytes, which means we are able to
    //essentially randomly pick out 4 bytes.
    //The bytes are consecutive by the way
    //For example: if the last 4 bits of the last byte equal 15,
    //then we would have the indexes of 15,16,17,and 18
    //In other words, we are taking the 16th, 17th, 18th, and 19th bytes
    //Remember, we never will take the 20th(or last) byte, as that byte was used to get the indexes.
    let offset = (code_bytes[code_bytes.len() - 1] & 0x0f) as usize;

    //This part is honestly kinda tricky so I'll try my best to explain
    //The goal is to construct a six digit number
    //First, imagine this visualization: Byte 1 | Byte 2 | Byte 3 | Byte 4
    //These four bytes come from the offset and the three consecutive bytes after it
    //We want a 31 bit number, as that gives us a range from 0 to 2^31.
    //We are not using 32 bits, because that 32nd bit is the sign bit, which will only confuse us
    //
    //You might wonder why that first byte, we are using 0x7f whereas everyone else has 0xff
    //Essentially, we want to make sure that the first byte's highest bit is 0, so it doesn't lead
    //to overflow. 0x7f is 0111 1111 in hexadecimal
    //For reference, 0xff is 1111 1111, so it doesn't actually change their respective bytes
    //
    //The bitwise is to ensure we get a 31 bit number
    //Remember that a byte is 8 bits
    //The first byte is shifted 24 bits, so now it occupied the highest 8 bits (23-31)
    //The second byte is shifted 16 bits, so now it occupies the second set of 8 bits (16-23)
    //the third byte is shifted 8 bits, so now it occupies the third set of 8 bits (7-15)
    //The fourth byte remains still, so it occupies the lowest 8 bits (0-7)
    //
    //The | operator just adds the bits together
    let bin_code = ((u32::from(code_bytes[offset]) & 0x7f) << 24)
        | ((u32::from(code_bytes[offset + 1]) & 0xff) << 16)
        | ((u32::from(code_bytes[offset + 2]) & 0xff) << 8)
        | (u32::from(code_bytes[offset + 3]) & 0xff);

    //Lastly, this code just takes the last six digits of our number
    Ok(bin_code % 1_000_000)
}

pub fn create_secret_key() -> String {
    let test = "LEBRON JAMES";

    BASE32.encode(test.as_bytes())
}
pub fn create_jwt(header: &str, body: &str) -> Result<String, hmac::digest::InvalidLength> {
    let secret = "a-string-secret-at-least-256-bits-long";
    let header_token: String = URL_SAFE.encode(header.replace(" ", "").replace("\n", ""));
    let body_token: String = URL_SAFE.encode(body.replace(" ", "").replace("\n", ""));
    let combined = format!("{}.{}", header_token, body_token);
    type HmacSha256 = Hmac<Sha256>;
    let mut hashed_body = HmacSha256::new_from_slice(secret.as_bytes())?;
    hashed_body.update(combined.as_bytes());
    let result = hashed_body.finalize().into_bytes();
    let final_token = format!("{}.{}", combined, URL_SAFE.encode(result));
    return Ok(final_token);
}