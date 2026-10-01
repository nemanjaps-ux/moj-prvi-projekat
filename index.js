const express = require('express');
const app = express();
const PORT = 3000;

// Osnovna ruta - kada neko poseti http://localhost:3000/
app.get('/', (req, res) => {
    res.send('Zdravo! Ovo je moj prvi Node.js web server!');
});

// Provera statusa - test ruta
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server radi bez problema!' });
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server je pokrenut na adresi: http://localhost:${PORT}`);
});


