/*
fn main() {
    test();
}*/

// use lib::tester::printtest::test;
use lib::helpers::math;
#[tokio::main]
async fn main() {
    // test().await;
    let password: &str = "1234";
    let hash: String = math::hash(password);
    println!("{}", hash);
    let verified = math::verify_password("abc", &hash);
    println!("{}", verified);

}
