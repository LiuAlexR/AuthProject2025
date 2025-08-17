use std::fmt;
pub enum UserError {
    UserAlreadyExistsError,
    UnableToConnectToDatabaseError,
    DatabaseLookupError,
}
pub struct UserAlreadyExistsError;
impl fmt::Display for UserAlreadyExistsError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "The user already exists!")
    }
}
pub struct UnableToConnectToDatabaseError;
impl fmt::Display for UnableToConnectToDatabaseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Unable to connect to the database!")
    }
}
pub struct DatabaseLookupError;
impl fmt::Display for DatabaseLookupError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Error reading from database!")
    }
}

pub enum JWTError {
    InvalidSignatureError,
    HashingError,
    JWTFormattingError,
}
pub struct InvalidSignatureError;
impl fmt::Display for InvalidSignatureError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Signature is invalid!")
    }
}
pub struct HashingError;
impl fmt::Display for HashingError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Error hashing jwt!")
    }
}
pub struct JWTFormattingError;
impl fmt::Display for JWTFormattingError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Error parsing JWT!")
    }
}