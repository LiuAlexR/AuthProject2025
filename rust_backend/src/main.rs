use lib::helpers::database_interface::{self, get_max_id};
#[tokio::main]
async fn main() {
    let username = "Bob";
    let password: &str = "1234";
    println!("{}", database_interface::verify_password_from_database(username, password).await)
    // let max_id = get_max_id().await;
    // match max_id {
    //     Ok(item) => println!("{}", item),
    //     Err(_) => print!("error"),
    // }
}
