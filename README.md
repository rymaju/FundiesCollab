# FundiesCollab

Collaborative Real-Time Coding in Java using the Fundies 2 Tester and Image libraries.

This project is **not** meant to be a replacement for Eclipse for use in Fundies 2. This would be a _terrible_ replacement considering that it can't even run big bang or use the canvas in any way. It is however, a really easy way to share, save, and test simple programs.

## How It Works

Built with ReactJS and Express, hosted on a DigitalOcean droplet. Uses Northeastern's Fundamentals of Computer Science 2 Java Tester and Image libraries.

Code is shared in "rooms" that can be joined or shared by URL. Socket.io is used to create and connect these rooms. Changes to the code are broadcast to everyone in the room, and also stored in the backend, so you can leave and come back to the same code.

Code is sent as a POST request from the user's browser to the backend when they hit "Compile". The backend then writes the code to a file, compiles and runs it with the Tester and Image libraries (inside a docker container to prevent damage from arbitrary code execution), then returns stdout.

## Run Locally

Make sure your system has Git, Node.js, and Docker installed then run the following commands:

```
git clone https://github.com/rymaju/FundiesCollab.git
npm install
npm run build
npm start
```

## API

The backend can be accessed anywhere at `fundiescollab.com/api/compile/`

### `POST fundiescollab.com/api/compile/java`

Request Body:

```
{
	fileName: String,
	examplesClasses: [List-of String],
	javaCode: String,
	roomId: String
}
```

Request Body Example:

```
{
	fileName: 'Foo.java',
	examplesClasses: ['ExamplesFoo'],
	javaCode: 'public class Foo { ... }',
	roomId: 'crunchy-pineapple-0115'
}
```

#### `200 OK`

Response Body:

```
{
	out: String
}
```

Example Response Body:

Code compiled and ran successfuly with Tester Library

```
{
	out: 'Tester Library 3.0 ...'
}
```

Code did not compile

```
{
	out: '...Foo.java:1: error: package tester does not exist...'
}
```

Execution timed out

```
{
	out: ''
}
```

#### `429 Too Many Requests`

The API is rate limited to 5 requests per minute. If for some reason you need to spam compilation faster than that, then either something is wrong with the way you code or you're trying to break my server - both call for some serious self reflection.

#### `500 Internal Server Error`

Something terribly terribly wrong has occurred. Shoot me an email so I can fix it.
