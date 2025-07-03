use mongodb::{ 
	bson::{Document, doc},
	Client,
	Collection 
};
use bcrypt;
pub async fn more_test() -> mongodb::error::Result<Option<Document>> {
    let uri = "mongodb://localhost:27017/";
    // Create a new client and connect to the server
    let client = Client::with_uri_str(uri).await?;
    let database = client.database("authproject2025");
    let my_coll: Collection<Document> = database.collection("authentication");
    let found = my_coll.find_one(doc! { "user_id": 1 }).await?;
    return Ok(found);
}
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