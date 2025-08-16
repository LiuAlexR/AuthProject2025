use std::fmt;
pub enum AddUserError {
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