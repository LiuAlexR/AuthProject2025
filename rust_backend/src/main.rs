use actix_web::{App, Error, HttpResponse, HttpServer, Responder, post, web::Json};
use lib::helpers::database_interface::{
    get_secret_key_typed, get_user_id_from_username, verify_password_from_database,
};
use lib::helpers::math::{
    generate_jwt, generate_jwt_based_on_state, parse_jwt_signature, verify_jwt_signature,
};
use lib::services::*;

use actix_cors::Cors;
use lib::models::*;
use tokio::time::{Duration, sleep};
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
                Err(_) => {
                    return HttpResponse::InternalServerError().json("Failed to get the user ID");
                }
            },
            None => todo!(),
        },
        Err(_) => return HttpResponse::InternalServerError().json("Failed to get the user ID"),
    };
    let codes = match get_totp_codes_service(user_id).await {
        Ok(the_result) => the_result,
        Err(_) => return HttpResponse::InternalServerError().json("Failed to get the user ID"),
    };

    HttpResponse::Ok().json(codes)
}
#[post("/verify_login")]
async fn verify_login(user_data: Json<User>) -> impl Responder {
    println!("Here!");
    let user_id_result = get_user_id_from_username(&user_data.username).await;
    let user_id: i32 = match user_id_result {
        Ok(success) => match success {
            Some(the_document) => match the_document.get_i32("user_id") {
                Ok(id) => id,
                Err(_) => {
                    return HttpResponse::InternalServerError().json("Malformed database entry");
                }
            },
            None => {
                return HttpResponse::NotFound().json("User does not exist");
            }
        },
        Err(_) => {
            return HttpResponse::InternalServerError()
                .json("Was unable to retrieve user information");
        }
    };
    let is_password_correct: bool =
        verify_password_from_database(user_id, &user_data.password).await;
    if !is_password_correct {
        HttpResponse::Unauthorized().json("Wrong Password")
    } else {
        let jwt = match generate_jwt_based_on_state(user_id, true, false) {
            Ok(success) => success,
            Err(_) => {
                return HttpResponse::InternalServerError().json("Failed to generate a JWT token");
            }
        };
        return HttpResponse::Ok().json(jwt);
    }
}

#[post("/verify_login_password")] // Not in use. See verify_login
async fn verify_login_password(user_data: Json<User>) -> impl Responder {
    // Not in use. See verify_login
    println!("Here!");
    let is_password_correct: bool = verify_password_from_database(1, &user_data.password).await;
    if !is_password_correct {
        HttpResponse::Unauthorized().json("Wrong Password")
    } else {
        let jwt = generate_jwt_based_on_state(1, true, false).unwrap_or("fail".to_string());
        HttpResponse::Ok().json(jwt)
    }
}

#[post("/verify_login_2fa")]
async fn verify_login_2fa(user_data: Json<MFARequest>) -> impl Responder {
    let jwt = &user_data.jwt;
    let user_id_result = verify_jwt_signature(&jwt);
    let user_id = match user_id_result {
        Ok(res) => {
            if res == 0 {
                return HttpResponse::Forbidden().json("Login expired");
            } else {
                res
            }
        }
        Err(_) => return HttpResponse::Forbidden().json("Invalid token"),
    };
    let login_state = match parse_jwt_signature(&jwt) {
        Ok(res) => res,
        Err(_) => return HttpResponse::InternalServerError().json("JWT error"),
    };
    if login_state != 1 {
        return HttpResponse::Forbidden().json("Invalid state");
    }
    // let key = get_secret_key_typed(user_id).await;
    // let the_key_document = match key {
    //     Ok(result_doc) => {
    //         result_doc
    //     },
    //     Err(_) =>  {
    //         return HttpResponse::InternalServerError().json("Database error");
    //     },

    // };
    // let the_key = match the_key_document.get_str("2fa_key") {
    //     Ok(res) => res,
    //     Err(_) => {
    //         return HttpResponse::InternalServerError().json("Database error");
    //     },
    // };
    // let otp = get_totp_codes_service(user_id)
    let otp_res = get_totp_codes_service(user_id).await;
    let otp = match otp_res {
        Ok(res) => res,
        Err(_) => return HttpResponse::InternalServerError().json("Failed to generate otp"),
    };
    if otp.contains(&user_data.password) {
        let new_jwt = generate_jwt_based_on_state(user_id, true, true);
        match new_jwt {
            Ok(res) => {
                return HttpResponse::Ok().json(res);
            }
            Err(_) => {
                return HttpResponse::InternalServerError().json("Token Error");
            }
        }
    }
    return HttpResponse::Forbidden().json("Login expired");
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
            .service(verify_login_2fa)
    })
    .bind(("127.0.0.1", 8081))?
    .run()
    .await
}
// #[tokio::main]
// async fn main() {
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
// let start = std::time::Instant::now();
// let x = sleep(Duration::from_millis(200)).await;
// sleep(Duration::from_millis(200)).await;
// println!("{}", start.elapsed().as_micros() as f64 / 1000.0);
//     let jwt = generate_jwt_based_on_state(1, true, false).unwrap_or("err".to_string());
//     println!("{}", jwt);
//     let valid = verify_jwt_signature("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTU0NzQ1NDc1NTIsInVzZXIiOjEsInBhc3MiOnRydWUsInR3b2ZhIjpmYWxzZX0=.0cp5rqM2Ko1ToypszLd_6x2jAH0ufmmSQd8oIaLYWWI=");
//     match valid {
//         Ok(success) => println!("{}", success),
//         Err(error) => match error {
//             lib::errors::JWTError::InvalidSignatureError => println!("Invalid Signature"),
//             lib::errors::JWTError::HashingError => println!("Hashing"),
//             lib::errors::JWTError::JWTFormattingError => println!("Formatting"),
//         },
//     }
// }

