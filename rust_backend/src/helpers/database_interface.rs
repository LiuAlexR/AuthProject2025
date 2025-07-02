use crate::helpers::math::{hash, verify_password};
use mongodb::{
    Client, Collection,
    bson::{Document, doc},
};
pub async fn get_user(username: &str) -> mongodb::error::Result<Option<Document>> {
    let uri = "mongodb://localhost:27017/";
    // Create a new client and connect to the server
    let client = Client::with_uri_str(uri).await?;
    let database = client.database("authproject2025");
    let my_coll: Collection<Document> = database.collection("authentication");
    let found = my_coll.find_one(doc! { "username": username }).await?;
    return Ok(found);
}
pub async fn update_password(username: &str, password: &str) -> Result<mongodb::results::UpdateResult, mongodb::error::Error> {
    let passHash = hash(password);
    let uri = "mongodb://localhost:27017/";
    // Create a new client and connect to the server
    let client = Client::with_uri_str(uri).await?;
    let database = client.database("authproject2025");
    let my_coll: Collection<Document> = database.collection("authentication");
    let filter = doc! { "username": username };
    let update = doc! { "$set" : doc! {"password": passHash }};
    let result = my_coll.update_one(filter, update).await?;
    return Ok(result);
}
