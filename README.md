# Monorepo for a Rolodex app (CSV uploader) - React / Python / Mongo / Docker

## What is it

A mini-rolodex app where you can upload a CSV with emails, first names, last names (can be expanded but keeping it simple for demonstration sake.).

Has a mapping mechanism so you can match your CSV columns with the ones used in this app.

After upload, you can view the list of people in a table.

## How to run:

- Make sure you have Docker installed on your machine, then run `docker-compose up --build`.

- Once it's built and you haven't made any package changes, etc. you can just run `docker-compose up`.

WebClient changes will appear at `localhost:8080`

Server changes will appear at `localhost:9911`

Features:
* Fully dockerized client + server setup (see `docker-compose.yml`)
* Hot reload of client + server
* Drag/Drop file for upload
* React 16+
* Semantic UI for style
* AirBnB style syntax and ES linting
* Prettier on precommit to verify your code style is consistent
* Python API built with Flask
* API attached to MongoDB
* Jest for testing client code