use lib::helpers::database_interface::{create_new_user, get_max_id};
use lib::helpers::math::create_one_time_password;
use std::{thread, time::Duration};
#[tokio::main]
async fn main() {
    let username: &str = "Bobb";
    let password: &str = "12345";
    // println!("{}", database_interface::verify_password_from_database(username, password).await)

    let _ = create_new_user(username, password).await;
    let max_id = get_max_id().await;
    match max_id {
        Ok(item) => println!("{}", item),
        Err(_) => print!("error"),
    }

    create_one_time_password(password, "Lebron");

    // while (true) {
    //     create_one_time_password(password, "Lebron");
    //     thread::sleep(Duration::from_secs(30));
    // }
}
