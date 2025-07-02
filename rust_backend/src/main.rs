/*use lib::tester::printtest::test;
fn main() {
    test();
}*/

use mongodb::{ 
	bson::{Document, doc},
	Client,
	Collection 
};
#[tokio::main]
async fn main() -> mongodb::error::Result<()> {
    let uri = "mongodb://localhost:27017/";
    // Create a new client and connect to the server
    let client = Client::with_uri_str(uri).await?;
    let database = client.database("TestDatabase");
    let my_coll: Collection<Document> = database.collection("airbnb");
    let bed = my_coll.find_one(doc! { "beds": 4 }).await?;
    println!("Found a bed:\n{:#?}", bed);
    Ok(())
}
