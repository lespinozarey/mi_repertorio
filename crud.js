import pool from './db.js';

const consultarDB = (consulta) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await pool.query(consulta);
            resolve(result);
        } catch (error) {
            console.log(error);
            reject("No se pudo traer la información de los registros.");
        }
    });
};

const nuevaCancion = async (titulo, artista, tono) => {
    try {
        const query = {
            text: "INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3) RETURNING id, titulo, artista, tono",
            values: [titulo, artista, tono],
        };
        let results = await consultarDB(query);
        let cancion = results.rows[0];
        console.log(results.rows);
        return cancion
    } catch (error) {
        console.log('Error en la consulta a la base de datos', error);
        throw new Error("Error al intentar agregar una nueva canción.");
    }
};

const obtenerCanciones = async () => {
    try {
        let query = "SELECT * FROM canciones ORDER BY id";
        let results = await consultarDB(query);
        let canciones = results.rows;
        //console.log(canciones);
        return canciones;
    } catch (error) {
        console.log(error);
        throw new Error("Error al traer los datos de las canciones.");
    }
};

const editarCancion = async (id, titulo, artista, tono) => {
    try {
        const query = {
            text: "UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4 RETURNING id, titulo, artista, tono",
            values: [titulo, artista, tono, id],
        };
        let results = await consultarDB(query);
        let cancion = results.rows;
        console.log(cancion);
        return cancion
    } catch (error) {
        console.log(error);
        throw new Error("Error al intentar actualizar la canción.");
    }
};

const eliminarCancion = async (id) => {
    try {
        const query = {
            text: "DELETE FROM canciones WHERE ID = $1 RETURNING id",
            values: [id],
        };
        let results = await consultarDB(query);
        if (results.rowCount > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al intentar eliminar la canción.");
    }
};

let operaciones = {
    consultarDB,
    nuevaCancion,
    obtenerCanciones,
    editarCancion,
    eliminarCancion
}

export default operaciones;