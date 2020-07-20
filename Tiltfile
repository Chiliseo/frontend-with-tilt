# DataLink TiltFile - IDE for developing services
# Use Docker-Compose as a base to spin up our Tilt environment.
docker_compose("./docker-compose.yml")
docker_build('frontend_test_core', './app', live_update = [
    sync('./app', '/home/node/app'),
    run('npm i', trigger='package.json'),
    restart_container()
])