FROM node:10.15.1-alpine

RUN mkdir -p /opt/payor-example-node
WORKDIR /opt/payor-example-node

COPY ./src ./
RUN npm i

EXPOSE 4567

CMD [ "npm", "start" ]