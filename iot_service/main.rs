use std::env;
use std::net::SocketAddr;
use warp::{Filter, http::StatusCode, reply::Response};
use serde::{Deserialize, Serialize};

mod device_management;

#[derive(Debug)]
enum Error {
    EnvVarError(env::VarError),
    ParseIntError(std::num::ParseIntError),
    DeviceManagementError(String),
}

impl warp::reject::Reject for Error {}

struct Config {
    port: u16,
}

fn get_config() -> Result<Config, Error> {
    dotenv::dotenv().ok();
    let port_str = env::var("PORT").map_err(Error::EnvVarError)?;
    let port = port_str.parse::<u16>().map_err(Error::ParseIntError)?;

    Ok(Config { port })
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
    let result = device_management::control_device(&body.device_id, &body.action).await
        .map_err(|e| warp::reject::custom(Error::DeviceManagementError(e.to_string())));

    match result {
        Ok(message) => Ok(warp::reply::json(&ApiResponse {
            success: true,
            data: message,
        })),
        Err(e) => Err(e),
    }
}

fn build_api_response<T: Serialize>(status_code: StatusCode, success: bool, data: T) -> Response {
    let json = warp::reply::json(&ApiResponse { success, data });
    warp::reply::with_status(json, status_date).into_response()
}

async fn handle_rejection(err: warp::Rejection) -> Result<impl warp::Reply, std::convert::Infallible> {
    let (code, message) = if err.is_not_found() {
        (StatusCode::NOT_FOUND, "NOT_FOUND".to_string())
    } else if let Some(e) = err.find::<Error>() {
        match e {
            Error::DeviceManagementError(description) => (StatusCode::INTERNAL_SERVER_ERROR, description.clone()),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR".to_string()),
        }
    } else {
        (StatusCode::INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR".to_string())
    };

    Ok(build_api_response(code, false, message))
}

#[tokio::main]
async fn main() {
    let config = match get_config() {
        Ok(conf) => conf,
        Err(_) => {
            eprintln!("Failed to read the configuration.");
            std::process::exit(1);
        }
    };

    let perform_action = warp::post()
        .and(warp::path("device-action"))
        .and(warp::body::json())
        .and_then(perform_device_action);

    let routes = perform_action
        .with(warp::cors().allow_any_origin()) 
        .recover(handle_rejection);

    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    warp::serve(routes).run(addr).await;
}