if (!globalThis.crypto) {
    globalThis.crypto = require('node:crypto').webcrypto || require('node:crypto');
}
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware da Express može da čita JSON podatke iz zahteva
app.use(express.json());

// Povezivanje na MongoDB u Docker-u preko porta 27017
mongoose.connect('mongodb://localhost:27017/moj_projekat')
    .then(() => console.log('Uspesno povezano na MongoDB bazu!'))
    .catch(err => console.error('Greska pri povezivanju na MongoDB:', err));

// --- KORAK 1: DEFINISANJE ŠEME I MODELA ---
const zadatakSchema = new mongoose.Schema({
    tekst: { type: String, required: true },
    zavrseno: { type: Boolean, default: false },
    datumKreiranja: { type: Date, default: Date.now }
});

const Zadatak = mongoose.model('Zadatak', zadatakSchema);
// ------------------------------------------

// --- KORAK 2: KREIRANJE API RUTA ---

// 1. Ruta za KREIRANJE novog zadatka (POST)
app.post('/zadaci', async (req, res) => {
    try {
        const noviZadatak = new Zadatak({
            tekst: req.body.tekst
        });

        const sacuvaniZadatak = await noviZadatak.save();
        res.status(201).json(sacuvaniZadatak);
    } catch (error) {
        res.status(500).json({ greska: 'Greška pri čuvanju zadatka: ' + error.message });
    }
});

// 2. Ruta za ČITANJE svih zadataka (GET)
app.get('/zadaci', async (req, res) => {
    try {
        const zadaci = await Zadatak.find();
        res.json(zadaci);
    } catch (error) {
        res.status(500).json({ greska: 'Greška pri učitavanju zadataka: ' + error.message });
    }
});
// ------------------------------------

// Osnovna ruta
app.get('/', (req, res) => {
    res.send('Zdravo! Server i baza rade savršeno!');
});

// Provera statusa servera i baze
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        dbConnection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' 
    });
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server je pokrenut na adresi: http://localhost:${PORT}`);
});
