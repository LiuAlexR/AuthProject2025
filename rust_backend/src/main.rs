use actix_web::{App, HttpResponse, HttpServer, Responder, get, post, web, web::Json};
use lib::services::*;

use actix_cors::Cors;
use lib::models::*;

#[post("/register_user")]
async fn hello(userData: Json<User>) -> impl Responder {
    register_user(userData.into_inner()).await;
    HttpResponse::Ok().body("WOW")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173")
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new().wrap(cors).service(hello)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
