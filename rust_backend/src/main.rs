use actix_web::{App, Error, HttpResponse, HttpServer, Responder, post, web::Json};
use lib::helpers::database_interface::verify_password_from_database;
use lib::helpers::math::{generate_jwt, generate_jwt_based_on_state};
use lib::services::*;

use actix_cors::Cors;
use lib::models::*;
#[post("/register_user")]
async fn register_user(user_data: Json<User>) -> impl Responder {
    let key = register_user_service(user_data.into_inner()).await;
    HttpResponse::Ok().json(key)
}

#[post("/get_codes")]
async fn get_code(username: String) -> Result<impl Responder, Error> {
    let codes = get_totp_codes_service(&username).await?;

    Ok(HttpResponse::Ok().json(codes))
}
#[post("/verify_login")]
async fn verify_login(user_data: Json<User>) -> impl Responder {
    println!("Here!");
    let is_password_correct: bool = verify_password_from_database(&user_data.username, &user_data.password).await;
    if !is_password_correct {
        HttpResponse::Unauthorized().json("Wrong Password")
    } else {
        let jwt = generate_jwt_based_on_state(true, false).unwrap();
        HttpResponse::Ok().json(jwt)
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting!");
    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173")
            .allowed_origin("http://localhost:8080")
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        App::new()
            .wrap(cors)
            .service(register_user)
            .service(get_code)
            .service(verify_login)
    })
    .bind(("127.0.0.1", 8081))?
    .run()
    .await
}
// #[tokio::main]
// async fn main() {
//     println!("{}", generate_jwt().unwrap());
// }