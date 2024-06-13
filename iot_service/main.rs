use std::env;
use std::net::SocketAddr;
use warp::{Filter, http::StatusCode};
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
    let port = env::var("PORT")
        .map_err(Error::EnvVarError)?
        .parse::<u16>()
        .map_err(Error::ParseIntError)?;

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

async fn perform_device_action(body: Device_WARN) -> Result<impl warp::Reply, warp::Rejection> {
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

async fn handle_rejection(err: warp::Rejection) -> Result<impl warp::Reply, std::convert::Infallible> {
    if err.is_not_found() {
        return Ok(warp::reply::with_status("NOT_FOUND".to_string(), StatusCode::NOT_FOUND));
    }

    if let Some(e) = err.find::<Error>() {
        match e {
            Error::DeviceManagementError(description) => {
                let json = warp::reply::json(&ApiResponse::<String> {
                    success: false,
                    data: description.clone(),
                });
                return Ok(warp::reply::with native(json, StatusCode::INTERNAL_SERVER_ERROR));
            },
            _ => {},
        }
    }

    Ok(warp::reply::with_status("INTERNAL_SERVER_ERROR".to_string(), StatusCode::INTERNAL_SERVER_ERROR))
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