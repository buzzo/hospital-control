# hospital-control
A full working backend and frontend CRUD example.

UI Technologies:
- angularJS
- browserify
- gulp

BE technologies:
- java 8
- spring boot
- spring web

Infrastructure:
- gradle
- docker
- docker-compose

### Quick Start
You will need [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [Node.js](https://nodejs.org), [docker](https://docs.docker.com/engine/installation/) and [docker-compose](https://docs.docker.com/compose/install/) installed in your machine.


```
cd hospital-control
./gradlew buildDocker
docker-compose up
```

Then just check [http://localhost:8080](http://localhost:8080)
