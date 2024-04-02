## Build

```
docker build --rm -t coworking .
```

## To run on a specific port
```
docker run --rm --name coworking -e DB_USERNAME=myuser -e DB_PASSWORD=mypassword -e DB_HOST=127.0.0.1 -e DB_PORT=5433 -e DB_NAME=mydatabase -p 5153:5153 coworking
```
