use crate::{errors::UserError, helpers::math::{hash, verify_password}};
use mongodb::{bson::{doc, Document}, Client, Collection};

const URI: &str = "mongodb://localhost:27017/";
pub async fn get_user_id_from_username(username: &str) -> Result<Option<Document>, UserError> {
    let client = match Client::with_uri_str(URI).await {
        Ok(success) => success,
        Err(_) => return Err(UserError::UnableToConnectToDatabaseError),
    };
    let database = client.database("Life360");
    let my_coll: Collection<Document> = database.collection("users");
    let found = match my_coll.find_one(doc! { "username": username }).await{
        Ok(document) => document,
        Err(_) => return Err(UserError::DatabaseLookupError),
    };
    Ok(found)
}
pub async fn get_user_password(user_id: i32) -> mongodb::error::Result<Option<Document>> {
    // Create a new client and connect to the server
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("Life360");
    let my_coll: Collection<Document> = database.collection("authentication");
    let found = my_coll.find_one(doc! { "user_id": user_id }).await?;

    Ok(found)
}
pub async fn update_password(
    user_id: i32,
    password: &str,
) -> Result<mongodb::results::UpdateResult, mongodb::error::Error> {
    //Hashes the password. The input password should be in plaintext
    let pass_hash = hash(password);
    // Create a new client and connect to the server
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("Life360");
    let my_coll: Collection<Document> = database.collection("authentication");
    // Selects the username
    let filter = doc! { "user_id": user_id };
    let update = doc! { "$set" : doc! {"password": pass_hash }};
    let result = my_coll.update_one(filter, update).await?;

    Ok(result)
}
pub async fn verify_password_from_database(user_id: i32, password: &str) -> bool {
    let the_pass = get_user_password(user_id).await;
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
            Err(error) => panic!("{}", error),
        },
        None => Ok(0),
    }
}

pub async fn create_new_user(username: &str, password: &str) -> Result<(), UserError> {
    let client = match Client::with_uri_str(URI).await {
        Ok(connection) => connection,
        Err(_) => {
            return Err(UserError::UnableToConnectToDatabaseError);
        },
    };
    let database = client.database("Life360");
    let collection: Collection<Document> = database.collection("users");

    // First, check if the user already exists
    let user_exists = match collection.find_one(doc! { "username": username } ).await {
        Ok(success) => success,
        Err(_) => {
            return Err(UserError::DatabaseLookupError);
        },
    };
    if user_exists.is_some()
    {
        println!("User already exists!");
        return Err(UserError::UserAlreadyExistsError); // or return an error, depending on your design
    }

    // Hash the password
    let hashed_password = hash(password);

    // Get the next user_id
    let max_id_doc = match collection
        .find_one(doc! {})
        .sort(doc! {"user_id": -1})
        .await {
            Ok(success) => success,
            Err(_) => return Err(UserError::DatabaseLookupError),
        };

    let new_user_id = match max_id_doc {
        Some(doc) => doc.get_i32("user_id").unwrap_or(0) + 1,
        None => 1,
    };

    // Insert new user document
    let new_user = doc! {
        "username": username,
        "user_id": new_user_id,
    };

    let insert_user_waiter = collection.insert_one(new_user);
    let user_auth_doc = doc! {
        "password": hashed_password,
        "user_id": new_user_id,
        "2fa_key": "blah", //todo fix this
    };
    let auth: Collection<Document> = database.collection("authentication");
    let _ = match auth.insert_one(user_auth_doc).await {
        Err(_) => return Err(UserError::DatabaseLookupError),
        _ => (),
    };
    let _ = match insert_user_waiter.await {
        Err(_) => return Err(UserError::DatabaseLookupError),
        _ => (),
    };
    println!("User created!");
    Ok(())
}

pub async fn add_secret_key(username: &str, key: &str) -> Result<(), mongodb::error::Error> {
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("Life360");
    let collection: Collection<Document> = database.collection("keys");

    let new_key = doc! {
        "username": username,
        "secret_key":key,
    };

    collection.insert_one(new_key).await?;

    Ok(())
}

pub async fn get_secret_key_typed(user_id: i32) -> Result<Document, mongodb::error::Error> {
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("Life360");
    let collection: Collection<Document> = database.collection("authentication");

    let doc: Document = collection
        .find_one(doc! {
            "user_id": user_id,
        })
        .await?
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "User not found"))?;

    Ok(doc)
}
