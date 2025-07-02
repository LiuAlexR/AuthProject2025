pub mod helpers {
    pub mod math;
    pub mod database_interface;
}
pub mod tester {
    pub mod printtest {
        // use crate::helpers::math::more_test;

        // pub async fn test() {
        //     println!("TEST");
        //     let a = more_test().await;
        //     match a {
        //         Ok(Some(listing)) => println!("{}", listing),
        //         Ok(None) => println!("None found"),
        //         Err(_e) => println!("Error"),
        //     }
            
        // }
    }
}
//Assume server stuff is abstracted away. I'm also on windows so Im also abstracting the database connections
pub mod validator {
    
}