/*
fn main() {
    test();
}*/

use core::error;
use std::result;

// use lib::tester::printtest::test;
use lib::helpers::{database_interface, math};
#[tokio::main]
async fn main() {
    // test().await;
    // let password: &str = "1234";
    // let hash: String = math::hash(password);
    // println!("{}", hash);
    // let verified = math::verify_password("abc", &hash);
    // println!("{}", verified);
    let username = "Bob";
    let user = database_interface::get_user(username).await;
    // let update_result = database_interface::update_password(username, "12345").await;
    // match update_result {
    //     Ok(result) => {println!("{}", result.matched_count)},
    //     Err(error) => println!("{}", error),
    // }
    match user {
        Ok(Some(result)) => {
            match result.get_str("password") {
                Ok(thePass) => println!("{}", thePass),
                Err(_) => todo!(),
            }
        },
        Ok(None) => println!("User does not exist!"),
        _ => todo!(),
    }
}
