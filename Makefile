db:
	docker-compose up -d db

network:
	docker network create payornode

build:
	docker-compose build --no-cache api

up:
	docker-compose run --service-ports api

sh:
	docker-compose run --service-ports api sh

down:
	docker-compose down

clean:
	docker rm /payor-example-node

destroy:
	docker rmi -f payor-example-node_api
	docker rmi -f payor-example-node_db
	docker rmi -f payor-example-node_velo
