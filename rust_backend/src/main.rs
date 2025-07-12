use actix_web::{App, Error, HttpResponse, HttpServer, Responder, get, post, web::Json};
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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173")
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(register_user)
            .service(get_code)
    })
    .bind(("127.0.0.1", 8081))?
    .run()
    .await
}
// fn main() {
//     let text = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
//     let body = "{\"expire\":1111}";
//     let token = math::generate_jwt();
//     let new_body = body.replace(" ", "").replace("\n", "");
//     let encoded = URL_SAFE.encode(new_body);
//     println!("{}", encoded);
//     let decoded = URL_SAFE.decode(encoded);
//     match decoded {
//         Ok(result) => println!("{}", String::from_utf8(result).unwrap_or("error".to_string())),
//         Err(_) => println!("Error"),
//     }
//     match token {
//         Ok(result) => println!("{}", result),
//         Err(error) => println!("{}", error)
//     }
//     println!("{}", verify_jwt_signature("eyJhbGciOiI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjExMTF9.J3KwXRrTHuOEkX0bXWRtLJwBnBpNQNqSnioeIMYt-aE=").unwrap());
// }