use std::process::{Child, Command};
use std::sync::Mutex;

use tauri::{Manager, RunEvent};

struct BackendProcess(Mutex<Option<Child>>);

fn spawn_backend(app: &tauri::AppHandle) {
    let resource_dir = app
        .path()
        .resource_dir()
        .expect("failed to resolve resource dir");
    let jar_path = resource_dir.join("resources").join("backend.jar");

    if !jar_path.exists() {
        log::error!("Backend jar not found at {:?}", jar_path);
        return;
    }

    let mut command = Command::new("java");
    command.arg("-jar").arg(&jar_path);

    // En Windows, evita que aparezca una ventana de consola negra al lanzar java.
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x0800_0000;
        command.creation_flags(CREATE_NO_WINDOW);
    }

    match command.spawn() {
        Ok(child) => {
            log::info!("Backend started (pid {})", child.id());
            app.state::<BackendProcess>().0.lock().unwrap().replace(child);
        }
        Err(err) => {
            log::error!("Failed to start backend: {err}. Is Java installed and on PATH?");
        }
    }
}

fn stop_backend(app: &tauri::AppHandle) {
    if let Some(mut child) = app.state::<BackendProcess>().0.lock().unwrap().take() {
        let _ = child.kill();
        let _ = child.wait();
        log::info!("Backend stopped");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(BackendProcess(Mutex::new(None)))
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            // El updater solo existe en escritorio (no en móvil).
            #[cfg(desktop)]
            app.handle().plugin(tauri_plugin_updater::Builder::new().build())?;

            spawn_backend(&app.handle().clone());
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app_handle, event| {
            if let RunEvent::ExitRequested { .. } = event {
                stop_backend(app_handle);
            }
        });
}
