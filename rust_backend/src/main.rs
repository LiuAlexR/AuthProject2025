use lib::helpers::database_interface::{self, create_new_user, get_max_id};
#[tokio::main]
async fn main() {
    let username = "Bobb";
    let password: &str = "12345";
    // println!("{}", database_interface::verify_password_from_database(username, password).await)

    let _ = create_new_user(username, password).await;
    let max_id = get_max_id().await;
    match max_id {
        Ok(item) => println!("{}", item),
        Err(_) => print!("error"),
    }
}
