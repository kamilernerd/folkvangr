.PHONY: all one two three

BINARY_NAME = folkvangr
BUILD_DIR = out/bin
BUILD_PATH = ${BUILD_DIR}/${BINARY_NAME}
WORKER_PATH = proc_watcher_worker.ts

run:
	@echo "Running"	
	@deno run --unstable-kv --allow-all main.ts

build:
	@echo "Building..."	
	@deno compile --allow-sys --allow-read --allow-net --unstable --include ${WORKER_PATH} --output ${BUILD_PATH} main.ts >> /dev/null

clean:
	@echo "Cleaning up"
	@rm ${BUILD_PATH}
	@rmdir -p ${BUILD_DIR}
