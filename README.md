# ARCHIVED

This was a super fun project but I cant afford to keep paying for the domain and the server to keep this thing running! Of course feel free to look around the code and email me if you're curious about the project!

# FundiesCollab

Collaborative Real-Time Coding in Java using the Fundies 2 Tester and Image libraries.

This project is **not** meant to be a replacement for Eclipse for use in Fundies 2. This would be a _terrible_ replacement considering that it can't even run big bang or use the canvas in any way. It is however, a really easy way to share, save, and test simple programs.

## How It Works

Built with Vue and Express, hosted on a DigitalOcean droplet. Uses Northeastern's Fundamentals of Computer Science 2 Java Tester and Image libraries.

Code is shared in "rooms" that can be joined or shared by URL. Socket.io is used to create and connect these rooms. Changes to the code are broadcast to everyone in the room, and also stored in the backend, so you can leave and come back to the same code. The code editor is Monaco Editor, the same powerful tool used by VSCode. As a consequence, the initial load of the website is quite large (~5mb), but users are expected to be running on relatively fast machines and connections.

Code is sent as a `POST` request from the user's browser to the backend when they hit "Compile". The backend then writes the code to a file, compiles and runs it with the Tester and Image libraries (inside a docker container to prevent damage from arbitrary code execution), then returns stdout.

Data for rooms is stored on the server in a Redis database. We chose Redis for its fast read/write operations and expiration features.

Users need to sign up or login to using an email & password supported by Firebase. You also need a Firebase authorization token to use the compile API endpoint.

If youre interested in the security aspects, see the [Security](#Security) section below.

## Contributing

If you're interested in this project and want to add something new, just fork the repository and make a pull request to merge your changes into master! If you are resolving an existing issue then make sure to tag it in your PR, or else if youre fixing an issue that does not already exist then please make an issue and assign it to yourself first!

After I look at your PR, I'll add comments or accept the PR. The changes then get merged into the production branch and dist is rebuilt. Then the changes are uploaded to the droplet.

## Run Locally

### Frontend & Backend

Make sure your system has Git, Node.js(>12.xx.xx), Redis, Java and Docker installed then run the following commands:

```sh
git clone https://github.com/rymaju/FundiesCollab.git
npm install
npm run build
npm start
```

The app will be live at `http://localhost:5000`.

Alternatively, you can also run the server using `pm2`, installed with `npm install -g pm2`.

To start the server, run `pm2 start ecosystem.config.js`.

This offers the advantage of being able to see metrics by using the commands `pm2 info server` or `pm2 monit`.

There should be a file called `firebase.config.example.js`, copy that file, rename it `firebase.config.js`, and fill it in with your own Firebase config. You can get a Firebase config at [firebase.google.com](https://firebase.google.com/), just create an account and follow the instructions.

### Frontend

If you just want to run and test the frontend, run `npm run serve` which will start the frontend on `http://localhost:8081`.

## API

The backend can be accessed at `fundiescollab.com/api/`.

### `POST fundiescollab.com/api/compile/java`

Headers:
`Authorization: Bearer <FIREBASE_ID_TOKEN>`
Requires a firebase ID token matching the config used for the frontend.

Request Body:

```json
{
  "fileName": STRING,
  "examplesClasses": [STRING],
  "javaCode": STRING,
  "roomId": STRING
}
```

Request Body Example:

```json
{
  "fileName": "Foo.java",
  "examplesClasses": ["ExamplesFoo"],
  "javaCode": "public class Foo { ... }",
  "roomId": "crunchy-pineapple-0115"
}
```

#### `200 OK`

The API will respond `200 OK` on successful compilation and runs, runtime errors, and compile time errors. These are all results that are expected and contain useful output that should be displayed to the user.

Response Body:

```json
{
  "out": STRING
}
```

Example Response Body:

Code compiled and ran successfully with Tester Library

```json
{
  "out": "Tester Library 3.0 ..."
}
```

Code did not compile

```json
{
  "out": "...Foo.java:1: error: package tester does not exist..."
}
```

#### `400 Bad Request`

Many things can lead to a bad request error. Check the error message sent in the response body for a detailed explanation. CUrrently the following problems can lead to a 400 error:

- Missing request body

- Invalid file name

  - Should be in the format `"Name.java"` and less than 50 char

- Invalid examplesClasses

  - Should be a JSON list of strings like `["ExamplesX","ExamplesY","ExamplesZ"]` and less than 100 char joined with spaces

- Invalid javaCode

  - Should be less than 25000 char

- Java execution timed out

  - Compilation and execution should take less than 15 seconds

#### `429 Too Many Requests`

The API is rate limited to 20 requests every 10 minutes. If for some reason you need to spam compilation faster than that, then either something is wrong with the way you code or you're trying to break my server - both call for some serious self reflection.

#### `401 Unauthorized`

Every request requires an "Authorization" header with a string "Bearer " followed by a valid Firebase ID JWT.

#### `500 Internal Server Error`

Something terribly terribly wrong has occurred. Shoot me an email so I can fix it.

### `GET fundiescollab.com/api/room/:id`

#### `200 OK`

Returns a json body describing whether the room exists or does not exist

```json
{
  "exists": BOOLEAN
}
```

#### `500 Internal Server Error`

Something terribly terribly wrong has occurred. Shoot me an email so I can fix it.

## Security

### Remote Code Execution

An app of this nature has to be especially sensitive to security concerns. Executing whatever arbitrary code the user uploads is as dangerous as it gets, so steps have been taken to eliminate the possibility of RCE (Remote Code Execution).

When users `POST` their code to the server as a string in the request body, the server will create a directory for that room and write the given code to a file named by the user. The commands for these actions (`fs.mkdir` and `fs.writeFile`) are immune to command injection, although they should be sanitized to prevent unexpected behavior. For example, ensuring that `fs.mkdir` is only called on a string with no spaces.

A docker container is then spun up which includes access to the library jar files and the room directory. This effectively protects the rest of the system from whatever malicious code may be executed in the java file. If the user did attempt to run commands from inside the container, the worst they could do is crash the container. The other resources available from within the docker container should be read only, and therefore immune to any modification.

### Denial of Service / Memory Attacks

The threat of denial of service attacks is two-fold: crippling the site such that no users can actually use the site, and deleting all saved work on the site. Under no circumstances should a barrage of request crash the application (or worse, the VPS that runs the application).

Conservative rate limiting is put in place to make sure that nobody can just spam the API. Users are allowed to make 20 requests over 10 minutes. On the frontend, the compile button is disabled until a response is received from the server.

Even with rate limiting, an attacker could still crash the application by sending enough requests to overflow the RAM capacity of Redis and our VPS, which would result in either Redis crashing and flushing, our VPS crashing, or both.

Therefore, we set a `maxmemory 100mb` in our Redis config file, so that Redis will never use more than 100mb of space. This is sufficient for our expected number of users and the amount of RAM that we bought for our VPS.

Another potential attack could be to write an immensely long string for `fileName`, `examplesClasses`, or `javaCode`. If successful it would waste a lot of resources, both disk space and computing power. Verification of the request body must enforce that all of the given strings are below an appropriate threshold.
