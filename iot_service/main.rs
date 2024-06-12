use std::env;
use std::net::SocketAddr;
use warp::Filter;
use serde::{Deserialize, Serialize};

mod device_management;

struct Config {
    port: u16,
}

fn get_config() -> Config {
    dotenv::dotenv().ok();
    let port = env::var("PORT")
        .unwrap_or_else(|_| "8000".to_string())
        .parse()
        .expect("PORT must be a number");

    Config { port }
}

#[derive(Deserialize)]
struct DeviceAction {
    device_id: String,
    action: String,
}

#[derive(Serialize)]
struct ApiResponse<T> {
    success: bool,
    data: T,
}

async fn perform_device_action(body: DeviceAction) -> Result<impl warp::Reply, warp::Rejection> {
    let result = device_management::control_device(&body.device_id, &body.action).await;
    
    match result {
        Ok(message) => Ok(warp::reply::json(&ApiResponse {
            success: true,
            data: message,
        })),
        Err(e) => Ok(warp::reply::json(&ApiResponse {
            success: false,
            data: e.to_string(),
        })),
    }
}

#[tokio::main]
async fn main() {
    let config = get_config();

    let perform_action = warp::post()
        .and(warp::path("device-action"))
        .and(warp::body::json())
        .and_then(perform_device_action);

    let routes = perform_action.with(warp::cors().allow_any_origin());

    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    warp::serve(routes).run(addr).await;
}