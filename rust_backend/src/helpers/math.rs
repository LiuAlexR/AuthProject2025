use bcrypt;
pub fn hash(password: &str) -> String {
    //Hashes the password
    let the_hash = bcrypt::hash(password, 12);
    match the_hash {
        Ok(t) => return t,
        Err(_e) => return "error".to_string(),

    }
}
pub fn verify_password(password: &str, hashed_password: &str) -> bool {
    let verified = bcrypt::verify(password, hashed_password);
    match verified {
        Ok(t) => return t,
        Err(_) => return false,
    }
}
