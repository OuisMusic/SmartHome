mod smart_home {
    use std::collections::HashMap;
    use std::env;

    pub struct DeviceManager {
        devices: HashMap<String, bool>,
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

            DeviceManager { devices }
        }

        pub fn turn_on(&mut self, device_name: &str) -> bool {
            self.set_device_state(device_name, true)
        }

        pub fn turn_off(&mut self, device_name: &str) -> bool {
            self.set_device_state(device_name, false)
        }

        fn set_device_state(&mut self, device_name: &str, state: bool) -> bool {
            if let Some(device_state) = self.devices.get_mut(device_name) {
                *device_state = state;
                true
            } else {
                false
            }
        }

        pub fn check_status(&self, device_name: &str) -> Option<bool> {
            self.devices.get(device_name).copied()
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

    manager.turn_off("Heaper");
    println!(
        "Heater status: {}",
        manager.check_status("Heater").unwrap_or(false)
    );
}