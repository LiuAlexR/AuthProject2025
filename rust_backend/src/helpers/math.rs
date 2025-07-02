use mongodb::{ 
	bson::{Document, doc},
	Client,
	Collection 
};

pub async fn more_test() -> mongodb::error::Result<Option<Document>> {
    // Replace the placeholder with your Atlas connection string
    let uri = "mongodb://localhost:27017/";
    // Create a new client and connect to the server
    let client = Client::with_uri_str(uri).await?;
    // Get a handle on the movies collection
    let database = client.database("TestDatabase");
    let my_coll: Collection<Document> = database.collection("airbnb");
    // Find a movie based on the title value
    let my_movie = my_coll.find_one(doc! { "beds": 4 }).await?;
    // Print the document
    println!("Found a movie:\n{:#?}", my_movie);
    Ok(my_movie)
}