use actix_web::{App, Error, HttpResponse, HttpServer, Responder, post, web::Json};
use lib::helpers::database_interface::{get_user_id_from_username, verify_password_from_database};
use lib::helpers::math::{generate_jwt, generate_jwt_based_on_state};
use lib::services::*;

use actix_cors::Cors;
use lib::models::*;
use tokio::time::{sleep, Duration};
#[post("/register_user")]
async fn register_user(user_data: Json<User>) -> impl Responder {
    let key = register_user_service(user_data.into_inner()).await;
    HttpResponse::Ok().json(key)
}

#[post("/get_codes")]
async fn get_code(username: String) -> impl Responder {
    let user_id_option = get_user_id_from_username(&username).await;
    let user_id = match user_id_option {
        Ok(success) => match success {
            Some(the_document) => match the_document.get_i32("user_id") {
                Ok(the_id) => the_id,
                Err(_) => return HttpResponse::InternalServerError().json("Failed to get the user ID"),
            },
            None => todo!(),
        },
        Err(_) => return HttpResponse::InternalServerError().json("Failed to get the user ID"),
    };
    let codes = match get_totp_codes_service(user_id).await {
        Ok(the_result) => the_result,
        Err(_) => return HttpResponse::InternalServerError().json("Failed to get the user ID")
    };

    HttpResponse::Ok().json(codes)
}
#[post("/verify_login")]
async fn verify_login(user_data: Json<User>) -> impl Responder {
    println!("Here!");
    let is_password_correct: bool = verify_password_from_database(1, &user_data.password).await;
    if !is_password_correct {
        HttpResponse::Unauthorized().json("Wrong Password")
    } else {
        let jwt = generate_jwt_based_on_state(1, true, false).unwrap();
        HttpResponse::Ok().json(jwt)
    }
}

#[post("/verify_login_password")]
async fn verify_login_password(user_data: Json<User>) -> impl Responder {
    println!("Here!");
    let is_password_correct: bool = verify_password_from_database(1, &user_data.password).await;
    if !is_password_correct {
        HttpResponse::Unauthorized().json("Wrong Password")
    } else {
        let jwt = generate_jwt_based_on_state(1, true, false).unwrap();
        HttpResponse::Ok().json(jwt)
    }
}

#[post("/verify_login_2fa")]
async fn verify_login_2fa(user_data: Json<MFARequest>) -> impl Responder {
    println!("Here!");
    let is_password_correct: bool = verify_password_from_database(1, &user_data.password).await;
    if !is_password_correct {
        HttpResponse::Unauthorized().json("Wrong Password")
    } else {
        let jwt = generate_jwt_based_on_state(1, true, false).unwrap();
        HttpResponse::Ok().json(jwt)
    }
}
// #[actix_web::main]
// async fn main() -> std::io::Result<()> {
//     println!("Starting!");
//     HttpServer::new(|| {
//         let cors = Cors::default()
//             .allowed_origin("http://localhost:5173")
//             .allowed_origin("http://localhost:8080")
//             .allow_any_method()
//             .allow_any_header()
//             .max_age(3600);
//         App::new()
//             .wrap(cors)
//             .service(register_user)
//             .service(get_code)
//             .service(verify_login)
//     })
//     .bind(("127.0.0.1", 8081))?
//     .run()
//     .await
// }
#[tokio::main]
async fn main() {
//     let data = "{\"password\":\"12345\",\"jwt\":\"1234567\"}";
//     let result = serde_json::from_str(data);
//     let request: UserRequest = match result {
//         Ok(req) => {
//             req
//         }
//         Err(_) => {
//             let user = UserRequest {
//                 username: "Error".to_string(),
//                 password: "Error".to_string(),
//                 jwt: "wdaq".to_string(),
//             };
//             user
//         }
            
//     };
//     println!("{}", request.username);
// }
    let start = std::time::Instant::now();
    let x = sleep(Duration::from_millis(200)).await;
    sleep(Duration::from_millis(200)).await;
    println!("{}", start.elapsed().as_micros() as f64 / 1000.0);
}