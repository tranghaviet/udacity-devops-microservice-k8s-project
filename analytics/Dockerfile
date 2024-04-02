
# Use an official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.9-alpine3.19

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV DB_USERNAME=myuser
ENV DB_PASSWORD=mypassword
ENV DB_HOST=127.0.0.1
ENV DB_PORT=5433
ENV DB_NAME=mydatabase

# Make port 5153 available to the world outside this container
EXPOSE 5153

# Run app.py when the container launches
CMD ["python", "app.py"]
