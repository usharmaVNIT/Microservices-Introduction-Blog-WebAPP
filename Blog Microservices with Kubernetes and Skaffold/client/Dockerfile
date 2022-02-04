# Base Image to have some basic programs
 FROM node:alpine

# For create react app open issue
# see https://github.com/facebook/create-react-app/issues/8688
ENV CI=true


# Setting the working directories
WORKDIR /app

# First copy the package.json to install the dependencies
# So if we change any file the dependiencies will be fetched from
# the cache rather than installed again and again

COPY ./package.json ./

# install the dependencies
RUN npm install

COPY ./ ./


CMD [ "npm" , "start" ]