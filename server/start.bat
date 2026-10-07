@echo off
call ..\node_modules\.bin\json-server.cmd --watch db.json --routes routes.json --port 3000
