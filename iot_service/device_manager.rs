mod smart_home {
    use std::collections::HashMap;
    use std::env;
    use std::time::{Duration, Instant};
    use std::thread;

    pub struct DeviceManager {
        devices: HashMap<String, bool>,
        last_sync: Instant,
        sync_interval: Duration,
    }

    #[derive(Debug)]
    pub enum DeviceError {
        DeviceNotFound(String),
        EnvVarError(String),
    }

    impl DeviceManager {
        pub fn new() -> Result<Self, DeviceError> {
            let mut devices = HashMap::new();

            let device_names = env::var("DEVICE_NAMES").map_err(|_| DeviceError::EnvVarError("Failed to read DEVICE_NAMES from environment".to_string()))?;
            let device_states = env::var("DEVICE_STATES").map_err(|_| DeviceError::EnvVarError("Failed to read DEVICE_STATES from environment".to_string()))?;

            let names_vec: Vec<&str> = device_names.split(',').collect();
            let states_vec: Vec<&str> = device_states.split(',').collect();

            for (i, &name) in names_vec.iter().enumerate() {
                if let Some(state_str) = states_vec.get(i) {
                    let state = state_str == "true";
                    devices.insert(name.to_string(), state);
                }
            }

            Ok(DeviceManager { 
                devices,
                last_sync: Instant::now(),
                sync_interval: Duration::from_secs(60),
            })
        }

        pub fn turn_on(&mut self, device_name: &str) -> Result<bool, DeviceError> {
            self.batch_process(); 
            self.set_device_state(device_name, true)
        }

        pub fn turn_off(&mut self, device_name: &str) -> Result<bool, DeviceError> {
            self.batch_process(); 
            self.set_device_state(device_name, false)
        }

        fn set_device_state(&mut self, device_name: &str, state: bool) -> Result<bool, DeviceError> {
            if let Some(device_state) = self.devices.get_mut(device_name) {
                *device_state = state;
                Ok(true) 
            } else {
                Err(DeviceError::DeviceNotFound(device_name.to_string()))
            }
        }

        pub fn check_status(&self, device_name: &str) -> Option<bool> {
            self.devices.get(device_name).copied()
        }

        fn batch_process(&mut self) {
            if self.last_sync.elapsed() >= self.sync_interval {
                println!("Syncing device states...");
                self.last_sync = Instant::now();
                thread::sleep(Duration::from_millis(100)); 
            }
        }
    }
}

fn main() {
    let mut manager = match smart_home::DeviceManager::new() {
        Ok(manager) => manager,
        Err(e) => {
            eprintln!("Failed to initialize device manager: {:?}", e);
            return;
        },
    };

    match manager.turn_on("Light") {
        Ok(_) => println!("Light status: {}", manager.check_status("Light").unwrap_or(false)),
        Err(e) => eprintln!("Error turning on the Light: {:?}", e),
    }

    std::thread::sleep(std::time::Duration::from_secs(1)); 

    match manager.turn_off("Heater") {
        Ok(_) => println!("Heater status: {}", manager.check_status("Heater").unwrap_or(false)),
        Err(e) => eprintln!("Error turning off the Heater: {:?}", e),
    };
}