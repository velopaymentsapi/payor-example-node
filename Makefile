db:
	docker-compose up -d db

env:
	cp src/.env-example src/.env

network:
	- docker network create payornode

build:
	docker-compose build --no-cache api

up: clean network
	docker-compose run --service-ports api

sh:
	docker-compose run --service-ports api sh

down:
	docker-compose down

clean:
	- docker rm /payor-example-node
	- docker rm /db

destroy:
	- docker rmi -f payor-example-node_api
