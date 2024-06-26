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

    impl DeviceManager {
        pub fn new() -> Self {
            let mut devices = HashMap::new();

            let device_names = env::var("DEVICE_NAMES")
                .unwrap_or_else(|_| "Light,Heater,Fan".to_string());
            let device_states = env::var("DEVICE_STATES")
                .unwrap_or_else(|_| "false,false,false".to_string());

            let names_vec: Vec<&str> = device_names.split(',').collect();
            let states_vec: Vec<&str> = device_states.split(',').collect();

            for (i, &name) in names_vec.iter().enumerate() {
                if let Some(state_str) = states_vec.get(i) {
                    let state = state_str == "true";
                    devices.insert(name.to_string(), state);
                }
            }

            DeviceManager { 
                devices,
                last_sync: Instant::now(),
                sync_interval: Duration::from_secs(60), // Adjust as appropriate for your use case
            }
        }

        pub fn turn_on(&mut self, device_name: &str) -> bool {
            self.batch_process(); // Check for batching before applying a command
            self.set_device_state(device_name, true)
        }

        pub fn turn_off(&mut self, device_name: &str) -> bool {
            self.batch_process(); // Check for batching before applying a command
            self.set_device_state(device_name, false)
        }

        fn set_device_state(&mut self, device_name: &str, state: bool) -> bool {
            if let Some(device_state) = self.devices.get_mut(device_name) {
                *device_state = state;
                true // Theoretically, an API call could be made here
            } else {
                false
            }
        }

        pub fn check_status(&self, device_name: &str) -> Option<bool> {
            self.devices.get(device_name).copied()
        }

        fn batch_process(&mut self) {
            if self.last_sync.elapsed() >= self.sync_interval {
                // Placeholder for an API call to batch process device state changes
                println!("Syncing device states...");

                // Update last_sync time after the batch operation
                self.last_sync = Instant::now();
                // Here, you would send out all the queued commands or state changes
                // In a real implementation, this would involve consolidating the changes and making a single or minimal number of API calls

                // This sleep is for demonstration. In actual implementation, this would rather be the time taken by the API call(s) 
                // to update the device states remotely
                thread::sleep(Duration::from_millis(100)); 
            }
        }
    }
}

fn main() {
    let mut manager = smart_home::DeviceManager::new();

    manager.turn_on("Light");
    println!(
        "Light status: {}",
        manager.check_status("Light").unwrap_or(false)
    );

    // Simulate a bit of a delay to showcase batching could happen
    std::thread::sleep(std::time::Duration::from_secs(1)); 

    manager.turn_off("Heater");
    println!(
        "Heater status: {}",
        manager.check_status("Heater").unwrap_or(false)
    );
}