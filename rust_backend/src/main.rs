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
    // 
    // let hash: String = math::hash(password);
    // println!("{}", hash);
    // let verified = math::verify_password("abc", &hash);
    // println!("{}", verified);
    let username = "Bob";
    let password: &str = "12345";
    println!("{}", database_interface::verify_password_from_database(username, password).await)
}
