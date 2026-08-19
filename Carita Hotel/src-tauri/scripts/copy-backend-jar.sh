#!/bin/sh
# Builds the Spring Boot backend and copies the runnable jar into
# src-tauri/resources so Tauri can bundle it and spawn it as a local process.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/../../../backend"
RESOURCES_DIR="$SCRIPT_DIR/../resources"

echo "Building backend jar..."
(cd "$BACKEND_DIR" && ./mvnw -q clean package -DskipTests)

JAR_PATH=$(find "$BACKEND_DIR/target" -maxdepth 1 -name "*.jar" ! -name "*.original" | head -n 1)

if [ -z "$JAR_PATH" ]; then
  echo "No jar found in $BACKEND_DIR/target" >&2
  exit 1
fi

mkdir -p "$RESOURCES_DIR"
cp "$JAR_PATH" "$RESOURCES_DIR/backend.jar"
echo "Copied $JAR_PATH -> $RESOURCES_DIR/backend.jar"
