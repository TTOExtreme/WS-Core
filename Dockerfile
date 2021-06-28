FROM node:12.18-alpine
ENV NODE_ENV=production
RUN mkdir /opt/Programas
RUN mkdir /opt/Programas/WS-Core
WORKDIR /opt/Programas/WS-Core
#COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
#COPY . .
#RUN apk add --no-cache git python make g++
#RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
