FROM node:11.15.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .
CMD [ "npm", "start" ]