
https://velopaymentsapi.github.io/VeloOpenApi/branch/v2.11/openapi.json


docker build -t oasconverter .
docker run -v /Users/bhalle/velo/open-gen/spec:/tmp -e OPENAPI_FILE=openapi.json open > swagger-codegen/out/spec/swagger_2.json



git clone https://github.com/swagger-api/swagger-codegen
cd swagger-codegen
./run-in-docker.sh mvn package


./run-in-docker.sh help # Executes 'help' command for swagger-codegen-cli
./run-in-docker.sh langs # Executes 'langs' command for swagger-codegen-cli

./run-in-docker.sh generate -i out/spec/swagger_2.json -l javascript -o /gen/out/velo-node -DpackageName=velo













docker-compose up --build  