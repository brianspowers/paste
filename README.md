# paste
A real simple Pastebin-style snippet app.  Actually it's a clone of what we called "Mimir Paste" at Hudl.

For the stack, it's an ancient ejected create-react-app, Bulma css framework, and a node back-end that talks to mongodb.  It's currently deployed on Heroku and MongoDB Atlas where my wife & I still use it to communicate certain things.

While this is in no way a secure app, snippets are encrypted in the database, so at least having the URL should be necessary to read the content.

If for some reason you wanted to run this app for yourself, the following environment variables are required to be present:
* ENCRYPTION_KEY
* DB_USER
* DB_PASS
* DB_HOST
* DB_NAME
* DB_REPLICA_SET

I'd recommend using Atlas for your mongo instance as I've pretty-much hard-coded the connection string.
