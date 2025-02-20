'use strict'

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import express from 'express';
import cookieParser from 'cookie-parser';
import sqlite from 'sqlite3';

import {methods as addcard} from './controllers/addcard.controller.js';

var app = express();
var port = process.env.PORT || 3999;
app.listen(port, () => {console.log("El servidor esta corriendo correctamente en el puerto "+port);});

app.use(express.static(__dirname + '/public/'));
app.use(express.json());
app.use(cookieParser());

const db = new sqlite.Database(
    path.resolve(__dirname + '/enforth.db'),
    (error) => {
        if(error) {
            return console.error(error);
        }

        db.run(` 
            CREATE TABLE IF NOT EXISTS Cartas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                card_id INTEGER,
                img_url TEXT, 
                expansion TEXT,
                edicion TEXT,
                nombre TEXT,
                cantidad INTEGER,
                tipo_carta TEXT,
                tipo TEXT,
                carpeta TEXT,
                folio INTEGER,
                vendida INTEGER,
                precio_vendida TEXT
            )
        `, (error) => {if(error) return console.error(error)})
    }
);

app.get('/', (req, res) => res.status(200).sendFile(__dirname + '/pages/index.html'));
app.post('/api/agregarcarta', addcard.agregarcarta);
app.get('*', (req, res) => res.status(404).sendFile(__dirname + '/pages/'));