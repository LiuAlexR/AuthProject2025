use actix_web::{App, Error, HttpResponse, HttpServer, Responder, get, post, web::Json};
use lib::helpers::math::generate_jwt;
use lib::services::*;

use actix_cors::Cors;
use lib::models::*;
#[post("/register_user")]
async fn register_user(user_data: Json<User>) -> impl Responder {
    let key = register_user_service(user_data.into_inner()).await;
    HttpResponse::Ok().json(key)
}

// #[post("/get_codes")]
// async fn get_code(username: String) -> Result<impl Responder, Error> {
//     let codes = get_totp_codes_service(&username).await?;

//     Ok(HttpResponse::Ok().json(codes))
// }

// #[actix_web::main]
// async fn main() -> std::io::Result<()> {
//     HttpServer::new(|| {
//         let cors = Cors::default()
//             .allowed_origin("http://localhost:5173")
//             .allow_any_method()
//             .allow_any_header()
//             .max_age(3600);

use lib::helpers::database_interface::{create_new_user, get_max_id};

//         App::new()
//             .wrap(cors)
//             .service(register_user)
//             .service(get_code)
//     })
//     .bind(("127.0.0.1", 8081))?
//     .run()
//     .await
// }
#[tokio::main]
async fn main() {
    println!("{}", generate_jwt().unwrap());
}