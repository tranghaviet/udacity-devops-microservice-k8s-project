FROM node:18-alpine

WORKDIR /app

COPY . /app

RUN npm install

# Set environment variables
ENV DB_USERNAME=myuser
ENV DB_PASSWORD=mypassword
ENV DB_HOST=127.0.0.1
ENV DB_PORT=5433
ENV DB_NAME=mydatabase

# Make port 5153 available to the world outside this container
EXPOSE 5153

CMD ["node", "index.js"]
