# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
WORKDIR /frontend
# install app dependencies
# add app
COPY . /frontend
RUN npm run build

  