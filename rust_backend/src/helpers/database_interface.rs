use crate::helpers::math::{hash, verify_password};
use mongodb::{
    Client, Collection,
    bson::{Document, doc},
};
const URI: &str = "mongodb://localhost:27017/";
pub async fn get_user_password(username: &str) -> mongodb::error::Result<Option<Document>> {
    // Create a new client and connect to the server
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("authproject2025");
    let my_coll: Collection<Document> = database.collection("authentication");
    let found = my_coll.find_one(doc! { "username": username }).await?;
    return Ok(found);
}
pub async fn update_password(username: &str, password: &str) -> Result<mongodb::results::UpdateResult, mongodb::error::Error> {
    //Hashes the password. The input password should be in plaintext
    let pass_hash = hash(password);
    // Create a new client and connect to the server
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("authproject2025");
    let my_coll: Collection<Document> = database.collection("authentication");
    // Selects the username
    let filter = doc! { "username": username };
    let update = doc! { "$set" : doc! {"password": pass_hash }};
    let result = my_coll.update_one(filter, update).await?;
    return Ok(result);
}
pub async fn verify_password_from_database(username: &str, password: &str) -> bool {
    let the_pass = get_user_password(username).await;
    //Parses the password. the_pass is a result, so we need to cover Ok(some), Ok(none), and the error. Since we are validating, the Ok(none) and the Error can both return false
    match the_pass {
        Ok(Some(result)) => {
            match result.get_str("password") {
                Ok(text) => return verify_password(password, text),
                Err(_) => return false,
            }
        },
        Ok(None) => return false,
        Err(_) => return false,
    }
}
pub async fn get_max_id() -> Result<i32, mongodb::error::Error> {
    // Create a new client and connect to the server
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("authproject2025");
    let my_coll: Collection<Document> = database.collection("authentication");
    //sorts to find the current maximum id. This is necessary because ids are going to be in sequential order
    // Online says compiler optimizes this sort. IDK if it even works because my current test database only has one entry
    let found = my_coll.find_one(doc! {}).sort(doc! {"user_id": -1}).await?;
    match found {
        Some(found_document) => {
            match found_document.get_i32("user_id") {
                Ok(id) => return Ok(id),
                Err(_) => return Ok(0),
            }
        },
        None => return Ok(0),
    }
}