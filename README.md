VAPI - Vogel API

This is a server that handles all of the client application request. It can be thought of as a support desk and tries to satisfy the request itself. If it can not then it reaches out to other servers to fulfill the request.

Requests that can be solved:
- repo
- assets
- apps themselves

Requests that are passed on:
- Request to other APIS
- Request to a Database


Requirements:

- horizontally scalable - It needs to be that if traffic grows we can just start another VAPI server next to the first.
- not to handle cpu intensive tasks - these task can be passed on to another service and handled.
- to only store (on the server) what has to be stored.



TODO:
- finalize "COREprocess" to be used as base for other servers.
- Move relevant service to JAPI server.
- Move relevant services to VMART server.
