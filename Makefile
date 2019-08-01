db:
	docker-compose up -d db

env:
ifdef clone
	# make clone=1 key=123 secret=shhh payor=testers env
	cp .env.example .env
	sed -i.bak 's/VELO_API_APIKEY=contact_velo_for_info/VELO_API_APIKEY=$(key)/' .env && rm .env.bak
	sed -i.bak 's/VELO_API_APISECRET=contact_velo_for_info/VELO_API_APISECRET=$(secret)/' .env && rm .env.bak
	sed -i.bak 's/VELO_API_PAYORID=contact_velo_for_info/VELO_API_PAYORID=$(payor)/' .env && rm .env.bak
endif
	- mv .env src/.env

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
