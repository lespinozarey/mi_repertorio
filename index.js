import express from 'express';
import operaciones from './crud.js';

import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const log = console.log;
const port = 3000;

// MIDDLEWARES GENERALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DEJAR PÚBLICA LA CARPETA PUBLIC
app.use(express.static('public'));

//RUTA PÁGINA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.post('/cancion', async (req, res) => {
    try {
        const { titulo, artista, tono } = req.body;
        if (!titulo || !artista || !tono) {
            return res.status(400).json({
                message: 'Debe proporcionar todos los valores requeridos [titulo, artista,tono].'
            })
        }
        await operaciones.nuevaCancion(titulo, artista, tono);
        res.status(201).json({
            message: 'Canción agregada con éxito.'
        })
    } catch (error) {
        log('Error al intentar agregar la canción.', error)
        res.status(500).json({
            message: 'Error interno del servidor.'
        })
    }
});

app.get('/canciones', async (req, res) => {
    try {
        let canciones = await operaciones.obtenerCanciones();
        res.status(200).json(canciones)
    } catch (error) {
        log('Error al intentar obtener el listado de canciones.', error)
        res.status(500).json({
            message: 'Error interno del servidor.'
        })
    }
});

app.put('/cancion/:id', async (req, res) => {
    let id = req.params.id;
    const { titulo, artista, tono } = req.body;
    if (!titulo || !artista || !tono) {
        return res.status(400).json({
            message: 'Todos los campos [titulo, artista, tono] son requeridos para actualizar la canción.'
        });
    }
    try {
        const cancionActualizada = await operaciones.editarCancion(id, titulo, artista, tono)
        if (cancionActualizada) {
            res.status(200).send('Canción actualizado correctamente.');
        } else {
            res.status(404).send(`Canción con ID ${id} no encontrada.`);
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor al actualizar la canción.');
    }
});

app.delete('/cancion/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const cancionEliminada = await operaciones.eliminarCancion(id);
        if (cancionEliminada) {
            res.status(204).json({
                message: `Cancion ID ${id} eliminada correctamente. `
            });
        } else {
            res.status(404).json({
                message: `Canción con id ${id} no encontrada.`
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Error interno del servidor al eliminar la canción.',
            message: error.message
        });
    }
});

app.all('*', (req, res) => {
    res.send('Página no encontrada.')
});

app.listen(port, () => {
    log(`Servidor ejecutándose en puerto ${port}.`)
});