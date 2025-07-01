mod helpers {
    pub mod math;
}
pub mod tester {
    pub mod printtest {
        use crate::helpers::math::more_test;

        pub fn test() {
            println!("TEST");
            more_test();
        }
    }
}
//Assume server stuff is abstracted away. I'm also on windows so Im also abstracting the database connections
pub mod validator {
    
}