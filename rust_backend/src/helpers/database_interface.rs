use std::vec;

use data_encoding::BASE32;
use rand::prelude::*;

use crate::{
    errors::{DatabaseLookupError, UserError},
    helpers::math::{hash, verify_password},
};
use mongodb::{
    Client, Collection,
    bson::{Document, doc},
};

const URI: &str = "mongodb://localhost:27017/";
pub async fn get_user_id_from_username(username: &str) -> Result<Option<Document>, UserError> {
    let client = match Client::with_uri_str(URI).await {
        Ok(success) => success,
        Err(_) => return Err(UserError::UnableToConnectToDatabaseError),
    };
    let database = client.database("Life360");
    let my_coll: Collection<Document> = database.collection("users");
    let found = match my_coll.find_one(doc! { "username": username }).await {
        Ok(document) => document,
        Err(_) => return Err(UserError::DatabaseLookupError),
    };
    Ok(found)
}
pub async fn get_user_password(user_id: i32) -> Result<Option<Document>, UserError> {
    let client = match Client::with_uri_str(URI).await {
        Ok(success) => success,
        Err(_) => return Err(UserError::UnableToConnectToDatabaseError),
    };
    let database = client.database("Life360");
    let my_coll: Collection<Document> = database.collection("authentication");
    let found = match my_coll.find_one(doc! { "user_id": user_id }).await{
        Ok(val) => {
            val
        },
        Err(_) => {
            return Err(UserError::DatabaseLookupError);
        },
    };

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

pub async fn create_new_user(
    username: &str,
    password: &str,
    secret_key: &String,
) -> Result<(), UserError> {
    let client = match Client::with_uri_str(URI).await {
        Ok(connection) => connection,
        Err(_) => {
            return Err(UserError::UnableToConnectToDatabaseError);
        }
    };
    let database = client.database("Life360");
    let collection: Collection<Document> = database.collection("users");

    // First, check if the user already exists
    let user_exists = match collection.find_one(doc! { "username": username }).await {
        Ok(success) => success,
        Err(_) => {
            return Err(UserError::DatabaseLookupError);
        }
    };
    if user_exists.is_some() {
        println!("User already exists!");
        return Err(UserError::UserAlreadyExistsError); // or return an error, depending on your design
    }

    // Hash the password
    let hashed_password = hash(password);

    // Get the next user_id
    let max_id_doc = match collection
        .find_one(doc! {})
        .sort(doc! {"user_id": -1})
        .await
    {
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
        "2fa_key": secret_key,
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
    // current location of a user
    let user_locations: Collection<Document> = database.collection("locations");
    let user_location_doc: Document = doc! {
        "user_id": new_user_id,
        "latitude": 0f32,
        "longitude": 0f32,
        "altitude": 0f32,
        "timestamp": 0i64,

    };
    let _ = match user_locations.insert_one(user_location_doc).await {
        Err(_) => return Err(UserError::DatabaseLookupError),
        _ => (),
    };
    // todo implement this
    // let user_history: Collection<Document> = database.collection("history");
    // Stores the relations between users
    let user_relations: Collection<Document> = database.collection("relations");
    let users_that_can_view_self: Vec<i32> = vec![];
    let users_that_self_can_view: Vec<i32> = vec![];
    let request_users_that_can_view_self: Vec<i32> = vec![];
    let request_users_that_self_can_view: Vec<i32> = vec![];
    let relations_doc = doc! {
        "user_id": new_user_id,
        "can_see_me": users_that_can_view_self,
        "I_can_see": users_that_self_can_view,
        "r_can_see_me": request_users_that_can_view_self,
        "r_I_can_see": request_users_that_self_can_view,
    };
    let _ = match user_relations.insert_one(relations_doc).await {
        Err(_) => return Err(UserError::DatabaseLookupError),
        _ => (),
    };
    println!("User created!");
    Ok(())
}

pub async fn add_secret_key(username: &str, key: &str) -> Result<(), mongodb::error::Error> { // Not in use
    let client = Client::with_uri_str(URI).await?;
    let database = client.database("Life360");
    let collection: Collection<Document> = database.collection("authenti");

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
pub fn create_secret_key() -> String {
    const MAX: u32 = 30;
    let mut key = String::from("");
    let mut rng = rand::rng();

    for _ in 0..MAX {
        key.push(rng.random::<char>())
    }

    // let test = "LEBRON JAMES";

    BASE32.encode(key.as_bytes())
}
/// Allows some user to view another user
pub async fn create_user_watch_request(user_to_watch: i32, user_that_watches: i32) -> Result<u64, UserError> {
    let client = match Client::with_uri_str(URI).await {
        Ok(success) => success,
        Err(_) => return Err(UserError::DatabaseLookupError),
    };
    let database = client.database("Life360");
    let user_relations: Collection<Document> = database.collection("relations");
    let filter = doc! {
        "user_id": user_to_watch
    };
    let update = doc! {
        "$push": {
            "r_can_see_me": user_that_watches,
        }
    };
    let _update_result = match user_relations
        .update_one(filter, update)
        .await {
            Ok(res) => res,
            Err(_) => {
                return Err(UserError::UserDoesNotExistError);
            },
        };
    let filter_can_watch = doc! {
        "user_id": user_that_watches
    };
    let update_can_watch = doc! {
        "$push": {
            "r_I_can_see": user_to_watch,
        }
    };
    let _update_result_can_watch = match user_relations
        .update_one(filter_can_watch, update_can_watch)
        .await {
            Ok(res) => res,
            Err(_) => {
                return Err(UserError::UserDoesNotExistError);
            },
        };
    
    // let user_to_watch_doc_option: Option<Document> = match user_relations
    //     .find_one(doc! {
    //         "user_id": user_to_watch,
    //     })
    //     .await {
    //         Ok(success) => {
    //             success
    //         }
    //         Err(_) => {
    //             return Err(UserError::DatabaseLookupError);
    //         },
    //     };
    // let user_to_watch_doc = match user_to_watch_doc_option {
    //     Some(user_document) => user_document,
    //     None => {
    //         return Err(UserError::UserDoesNotExistError);
    //     },
    // };
    // user_to_watch_doc.
    // let user_that_watches_doc_option: Option<Document> = match user_relations
    //     .find_one(doc! {
    //         "user_id": user_that_watches,
    //     })
    //     .await {
    //         Ok(success) => {
    //             success
    //         }
    //         Err(_) => {
    //             return Err(UserError::DatabaseLookupError);
    //         },
    //     };
    // let user_that_watches_doc = match user_that_watches_doc_option {
    //     Some(user_document) => user_document,
    //     None => {
    //         return Err(UserError::UserDoesNotExistError);
    //     },
    // };
    
    
    return Ok(_update_result.modified_count);
}
/// Allows some user to view another user
pub async fn resolve_user_watch_request(user_to_watch: i32, user_that_watches: i32) -> Result<u64, UserError> {
    let client = match Client::with_uri_str(URI).await {
        Ok(success) => success,
        Err(_) => return Err(UserError::DatabaseLookupError),
    };
    let database = client.database("Life360");
    let user_relations: Collection<Document> = database.collection("relations");
    let mut counter:i8 = 0;
    let filter_r_user_to_watch = doc! {
        "user_id": user_to_watch
    };
    let update_pull_user_that_watches = doc! {
        "$pull": {
            "r_can_see_me": user_that_watches,
        }
    };
    let update_pull_user_to_watch_result = match user_relations
        .update_one(filter_r_user_to_watch, update_pull_user_that_watches)
        .await {
            Ok(res) => res,
            Err(_) => {
                return Err(UserError::UserDoesNotExistError);
            },
        };

    if update_pull_user_to_watch_result.modified_count == 1 {
        counter = counter + 1;
    }
    let filter_r_can_watch = doc! {
        "user_id": user_that_watches
    };
    let update_r_can_watch = doc! {
        "$pull": {
            "r_I_can_see": user_to_watch,
        }
    };
    let update_user_can_watch_result = match user_relations
        .update_one(filter_r_can_watch, update_r_can_watch)
        .await {
            Ok(res) => res,
            Err(_) => {
                return Err(UserError::UserDoesNotExistError);
            },
        };
    if update_user_can_watch_result.modified_count == 1 {
        counter = counter + 1;
    }
    if counter != 2 {
        return Err(UserError::DatabaseLookupError);
    }
    let update = doc! {
        "$push": {
            "can_see_me": user_that_watches,
        }
    };
    let filter_user_to_watch = doc! {
        "user_id": user_to_watch
    };
    let _update_result = match user_relations
        .update_one(filter_user_to_watch, update)
        .await {
            Ok(res) => res,
            Err(_) => {
                return Err(UserError::UserDoesNotExistError);
            },
        };
    let filter_can_watch = doc! {
        "user_id": user_that_watches
    };
    let update_can_watch = doc! {
        "$push": {
            "I_can_see": user_to_watch,
        }
    };
    let _update_result_can_watch = match user_relations
        .update_one(filter_can_watch, update_can_watch)
        .await {
            Ok(res) => res,
            Err(_) => {
                return Err(UserError::UserDoesNotExistError);
            },
        };
    return Ok(_update_result.modified_count);
}
/// Resets the server. Creates Alice, Bob, and Eve. Alice has a password of 1234, Bob has a password of 12345, Eve has a password of 123456. 
/// Alice and Bob are capable of viewing each other's location. Alice has a active request to view Eve's location, and Eve has an active request to view Bob's location
/// Purposely chosen for authentication server, despite concerning user information
pub async fn reset_database() -> Result<bool, mongodb::error::Error> {
    let client = Client::with_uri_str(URI).await?;
    let _database = client.database("Life360").drop().await;
    let new_database = client.database("Life360");
    let _ = create_new_user("Alice", "1234", &create_secret_key()).await;
    let _ = create_new_user("Bob", "12345", &create_secret_key()).await;
    let _ = create_new_user("Eve", "123456", &create_secret_key()).await;
    let _ = create_user_watch_request(3, 1).await;
    let _ = resolve_user_watch_request(3, 1).await;

    return Ok(true);
}