import * as express from 'express';
import * as loki from 'lokijs' ;
import * as basicAuth from 'express-basic-auth';
import {BAD_REQUEST, UNAUTHORIZED} from 'http-status-codes';

let app = express();
app.use(express.json()); 
const bAuth = basicAuth({ users: { admin: "P@ssw0rd!" } });

const db = new loki('./data.db', { autosave: true, autoload: true });
if(db.getCollection('guests') === null)
    db.addCollection('guests');

app.get('/party', (req, res, next) => {
    res.send({
        title: "Birthday Party",
        location: "Somewhere",
        date: "01.01.2970"
    });
});

app.post('/register', (req, res, next) => {
    if(!req.body.firstname || !req.body.lastname) 
        res.status(BAD_REQUEST).send('Parameters firstname and lastname are required!');
    if(db.getCollection('guests').count() > 10) 
        res.status(UNAUTHORIZED).send('Guest list is full!');
     db.getCollection('guests').insert({
        firstname: req.body.firstname, 
        lastname: req.body.lastname
    });
});

app.get('/guests', bAuth, (req, res, next) => {
    let abc = db.getCollection<{firstname: string, lastname: string}>('guests').find();
    res.send(abc.map(guests => ({
        firstname: guests.firstname,
        lastname: guests.lastname
    })));
    
});

app.listen(8080, () => console.log('API is listening'));