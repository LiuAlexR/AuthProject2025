use crate::helpers::math::{hash, verify_password};
use mongodb::{
    Client, Collection,
    bson::{Document, doc},
};
const URI: &str = "mongodb://localhost:27017/";
pub async fn get_user_password(username: &str) -> mongodb::error::Result<Option<Document>> {
    // Create a new client and connect to the server
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("Life360");
    let my_coll: Collection<Document> = database.collection("authentication");
    let found = my_coll.find_one(doc! { "username": username }).await?;

    Ok(found)
}
pub async fn update_password(
    username: &str,
    password: &str,
) -> Result<mongodb::results::UpdateResult, mongodb::error::Error> {
    //Hashes the password. The input password should be in plaintext
    let pass_hash = hash(password);
    // Create a new client and connect to the server
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("Life360");
    let my_coll: Collection<Document> = database.collection("authentication");
    // Selects the username
    let filter = doc! { "username": username };
    let update = doc! { "$set" : doc! {"password": pass_hash }};
    let result = my_coll.update_one(filter, update).await?;

    Ok(result)
}
pub async fn verify_password_from_database(username: &str, password: &str) -> bool {
    let the_pass = get_user_password(username).await;
    //Parses the password. the_pass is a result, so we need to cover Ok(some), Ok(none), and the error. Since we are validating, the Ok(none) and the Error can both return false
    match the_pass {
        Ok(Some(result)) => match result.get_str("password") {
            Ok(text) => verify_password(password, text),
            Err(_) => false,
        },
        Ok(None) => false,
        Err(_) => false,
    }
}
pub async fn get_max_id() -> Result<i32, mongodb::error::Error> {
    // Create a new client and connect to the server
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("Life360");
    let my_coll: Collection<Document> = database.collection("authentication");
    //sorts to find the current maximum id. This is necessary because ids are going to be in sequential order
    // Online says compiler optimizes this sort. IDK if it even works because my current test database only has one entry
    let found = my_coll.find_one(doc! {}).sort(doc! {"user_id": -1}).await?;
    match found {
        Some(found_document) => match found_document.get_i32("user_id") {
            Ok(id) => Ok(id),
            Err(_) => Ok(0),
        },
        None => Ok(0),
    }
}

pub async fn create_new_user(username: &str, password: &str) -> Result<(), mongodb::error::Error> {
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("Life360");
    let collection: Collection<Document> = database.collection("authentication");

    // First, check if the user already exists
    if collection
        .find_one(doc! { "username": username })
        .await?
        .is_some()
    {
        println!("User already exists!");
        return Ok(()); // or return an error, depending on your design
    }

    // Hash the password
    let hashed_password = hash(password);

    // Get the next user_id
    let max_id_doc = collection
        .find_one(doc! {})
        .sort(doc! {"user_id": -1})
        .await?;

    let new_user_id = match max_id_doc {
        Some(doc) => doc.get_i32("user_id").unwrap_or(0) + 1,
        None => 1,
    };

    // Insert new user document
    let new_user = doc! {
        "username": username,
        "password": hashed_password,
        "user_id": new_user_id,
    };

    collection.insert_one(new_user).await?;
    println!("User created!");
    Ok(())
}
