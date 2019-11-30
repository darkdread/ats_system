# ats_system
For SP

# How it works

Data flow is as follows: webapp -> ws -> python -> ws -> webapp.  
Python runs a child process cmd, that listens on stdin, stdout, and stderr.  
Submission of ats code -> webapp -> stdin.write(ats_code) -> executes python program.

List of id:pw is included in txt file.

# Test

Spin up a docker instance with docker-compose yml file. Docker instance has to be on localhost, otherwise change the host of the websocket.

`docker-compose -f docker/docker-compose.yml up` to start webapp on port 80. Websocket at port 8080.
