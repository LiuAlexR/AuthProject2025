use lib::helpers::math;
// use actix_web::{App, Error, HttpResponse, HttpServer, Responder, get, post, web::Json};
use lib::services::*;

// use actix_cors::Cors;
use lib::models::*;
use base64::{engine::general_purpose::URL_SAFE, Engine as _};
// #[post("/register_user")]
// async fn register_user(userData: Json<User>) -> impl Responder {
//     let key = register_user_service(userData.into_inner()).await;
//     HttpResponse::Ok().json(key)
// }

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

//         App::new()
//             .wrap(cors)
//             .service(register_user)
//             .service(get_code)
//     })
//     .bind(("127.0.0.1", 8080))?
//     .run()
//     .await
// }
fn main() {
    let text = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
    let body = "{\"expire\":111}";
    let token = math::create_jwt(text, body);
    let new_body = body.replace(" ", "").replace("\n", "");
    let encoded = URL_SAFE.encode(new_body);
    println!("{}", encoded);
    let decoded = URL_SAFE.decode(encoded);
    match decoded {
        Ok(result) => println!("{}", String::from_utf8(result).unwrap_or("error".to_string())),
        Err(_) => println!("Error"),
    }
    match token {
        Ok(result) => println!("{}", result),
        Err(error) => println!("{}", error)
    }
}