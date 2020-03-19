
# FundiesCollab

  

Collaborative Real-Time Coding in Java using the Fundies 2 Tester and Image libraries.


This project is **not** meant to be a replacement for Eclipse for use in Fundies 2. This would be a _terrible_ replacement considering that it can't even run big bang or use the canvas in any way. It is however, a really easy way to share, save, and test simple programs.

## How It Works

  

Built with ReactJS and Express, hosted on a DigitalOcean droplet. Uses Northeastern's Fundamentals of Computer Science 2 Java Tester and Image libraries.

  

Code is shared in "rooms" that can be joined or shared by URL. Socket.io is used to create and connect these rooms. Changes to the code are broadcast to everyone in the room, and also stored in the backend, so you can leave and come back to the same code.

  

Code is sent as a POST request from the user's browser to the backend when they hit "Compile". The backend then writes the code to a file, compiles and runs it with the Tester and Image libraries (inside a docker container to prevent damage from arbitrary code execution), then returns stdout.

  

Data for rooms is stored on the server in a Redis database. We chose Redis for its fast read/write operations and expiration features.

  

If youre interested in the security aspects, see the Security section below.

  

## Run Locally

  

### Frontend & Backend

  

Make sure your system has Git, Node.js, Redis, Java and Docker installed then run the following commands:

 
```
git clone https://github.com/rymaju/FundiesCollab.git
npm install
npm run build
npm start
```

 
The app will be live at `http://localhost:5000`.

  

Alternatively, you can also run the server using `pm2`, installed with `npm install -g pm2` by running `pm2 start ecosystem.config.js`. This offers the advantage of being able to see metrics by using the command `pm2 info server` or `pm2 monit`.

  

### Frontend

 
If you just want to run and test the frontend, run `npm run react` which will start the frontend on `http://localhost:3000`. Currently as the API is public, you can also set `NODE_ENV='production'` to use the API live at `fundiescollab.com`.


## API

 
The backend can be accessed anywhere at `fundiescollab.com/api/compile/`.

  

### `POST fundiescollab.com/api/compile/java`

  

Request Body:
```
{
	fileName: String,
	examplesClasses: [String],
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

The API will respond `200 OK` on successful compilation and runs, runtime errors, and compile time errors. These are all results that are expected and contain useful output that should be displayed to the user.

  

Response Body:

```
{
	out: String
}
```

  

Example Response Body:

Code compiled and ran successfully with Tester Library

 
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

  
  

#### `400 Bad Request`

Many things can lead to a bad request error. Check the error message sent in the response body for a detailed explanation. CUrrently the following problems can lead to a 400 error:

  

- Missing request body

- Invalid file name

    - Should be in the format "Name.java" and less than 50 char

- Invalid examplesClasses

    - Should be a JSON list of strings like ["ExamplesX","ExamplesY","ExamplesZ"] and less than 100 char joined with spaces

- Invalid javaCode

    - Should be less than 25000 char

- Java execution timed out

    - Validation, compilation, and execution should take less than 20 seconds

  

#### `429 Too Many Requests`

  

The API is rate limited to 20 requests every 10 minutes. If for some reason you need to spam compilation faster than that, then either something is wrong with the way you code or you're trying to break my server - both call for some serious self reflection.

  

#### `500 Internal Server Error`

  

Something terribly terribly wrong has occurred. Shoot me an email so I can fix it.

  
  

## Security

  

### Remote Code Execution

  

An app of this nature has to be especially sensitive to security concerns. Executing whatever arbitrary code the user uploads is as dangerous as it gets, so steps have been taken to eliminate the possibly of RCE (Remote Code Execution).

  

When users `POST` their code to the server as a request body, the server will create a directory for that room and write the given code to a file named by the user. The commands for these actions (`fs.mkdir` and `fs.writeFile`) are immune to command injection, although they should be sanitized to prevent unexpected behavior. For example, ensuring that `fs.mkdir` is only called on a string with no spaces.

  

A docker container is then spun up which includes access to the library jar files and the room directory. This effectively protects the rest of the system from whatever malicious code may be executed in the java file. If the user did attempt to run commands from inside the container, the worst they could do is crash the container. The other resources available from within the docker container should be read only, and therefore immune to any modification.

  

### Denial of Service / Memory Attacks

  

The threat of denial of service attacks is two-fold: crippling the site such that no users can actually use the site, and deleting all saved work on the site. Under no circumstances should a barrage of request crash the application (or worse, the VPS that runs the application).

  

Conservative rate limiting is put in place to make sure that nobody can just spam the API. On the client side React app, the compile button is disabled until a response is received from the server.

  

Even with rate limiting, an attacker could still crash the application by sending enough requests to overflow the RAM capacity of Redis and our VPS, which would result in either Redis crashing and flushing, our VPS crashing, or both.

  

Therefore, we set a `maxmemory 100mb` in our Redis config file, so that Redis will never use more than 100mb of data. This is sufficient for our expected number of users and the amount of RAM that we bought for our VPS.


Another potential attack could be to write an immensely long string for `fileName`, `examplesClasses`, or `javaCode`. If successful it would waste a lot of resources, both disk space and computing power. Verification of the request body must enforce that all of the given strings are below an appropriate threshold.