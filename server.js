let mysql = require("mysql");
let connection = mysql.createConnection({
    host: "localhost",
    database: "prueba",
    user: "root",
    password: null

});
connection.connect();

const { response } = require('express');
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const jwt = require("jsonwebtoken");
app.listen(4000)

const config = {
    llave: "miclaveultrasecreta123*"
};

app.set('llave', config.llave);

app.post('/login', (req, res) => {
    if (req.body.client_ID === "dare" && req.body.client_secret === "s3cr3t") {

        const payload = {
            check: true
        };

        const token = jwt.sign(payload, app.get('llave'), {
            expiresIn: 1440
        });

        res.send({
            code: 200,
            mensaje: 'Autenticación correcta',
            token: token,
            expiresIn: 1440
        });

    } else {

        res.send({ code: 401, mensaje: "Datos incorrectos" })

    }
})

const rutasProtegidas = express.Router();

rutasProtegidas.use((req, res, next) => {

    const token = req.headers['access-token'];

    if (token) {

        jwt.verify(token, app.get('llave'), (err, decoded) => {

            if (err) {

                return res.send({ code: 401, mensaje: 'Token no válido' });

            } else {

                req.decoded = decoded;
                next();

            }
        });

    } else {

        res.send({ codigo: 403, mensaje: 'No existe el token' });

    }
});

app.get("/clientes", rutasProtegidas,

    function (req, res) {

        let respuesta;
        id_cliente = req.query.id_cliente;

        if (req.query.id_cliente != null) {

            let params = [id_cliente]
            let consulta = "SELECT * FROM clientes WHERE id_cliente=?"
            connection.query(consulta, params, function (error, resultado) {

                if (error) {
                    res.send(error)
                } else {
                    if (resultado.length == 0) {
                        res.send({ 'mensaje': 'No existe el id' })
                    } else {
                        res.send(resultado)
                    }
                }

            })



        } else {
            let consulta = "SELECT * FROM clientes"
            connection.query(consulta, function (error, resultado) {
                if (error) {
                    respuesta = { error: true, codigo: 200, mensaje: 'No existen clientes con ese id' }
                } else {
                    respuesta = { error: false, codigo: 200, mensaje: 'Listado de clientes', resultado: resultado }
                }
                res.send(respuesta)

            })
        }
    }
);

app.post("/clientes", rutasProtegidas,
    function (req, res) {

        let name = req.body.name
        let surname = req.body.surname
        let id_envio = req.body.id_envio
    
        let params = [name,surname,id_envio]
        let sqlInsertAl = "INSERT INTO clientes (name,surname,id_envio) VALUES (?,?,?)"
        connection.query(sqlInsertAl, params, function (error, resultado) {

            if (error) {
                if (error.code == "ER_BAD_NULL_ERROR") {
                    res.send({ 'mensaje': 'No puedes introducir un valor nulo' })
                }
                else response.send(error)
            } else {
                res.send({ 'mensaje': 'Cliente añadido' })
            }
        })

    }


)

app.put("/clientes",rutasProtegidas,
    function (req, res) {
        let name = req.body.name
        let surname = req.body.surname
        let id_envio = req.body.id_envio
        let id_cliente = req.body.id_cliente
        let params = [name, surname, id_envio, id_cliente]
        if (req.body.id_cliente == null) {
            res.send({ "mensaje": "Introduce un id" })
        } else {



            let sqlInsertAl = 'UPDATE clientes SET name = COALESCE(?,name),surname = COALESCE(?,surname),id_envio = COALESCE(?,id_envio) WHERE id_cliente=?'

            connection.query(sqlInsertAl, params, function (error, resultado) {

                if (error) {
                    if (error.code == "ER_NO_REFERENCED_ROW_2") {
                        res.send({ 'mensaje': "Introduce un grupo que sea valido" })
                    } else {
                        res.send(error)
                    }
                } else {
                    if (resultado.affectedRows == 0) {
                        res.send({ 'mensaje': 'No existe el id' })
                    } else {
                        res.send({ "mensaje": 'cliente modificado' })
                    }
                }

            })

        }

    }
)

app.delete("/clientes",rutasProtegidas,
    function (req, res) {
        let id_cliente = req.body.id_cliente;
        let params = [id_cliente]
        let consulta = "DELETE FROM clientes WHERE id_cliente=?"
        connection.query(consulta, params, function (error, resultado) {
            if (error) {

                res.send(error)
            } else {
                if (resultado.affectedRows == 0) {
                    res.send({ 'mensaje': 'No existe el id' })
                } else {
                    res.send({ "mensaje": 'Cliente borrado' })
                }
            }
        })



    }
)

app.get("/envios",rutasProtegidas,

    function (req, res) {

        let respuesta;
        id_envio = req.query.id_envio;

        if (req.query.id_envio != null) {

            let params = [id_envio]
            let consulta = "SELECT * FROM envios WHERE id_envio=?"
            connection.query(consulta, params, function (error, resultado) {

                if (error) {
                    res.send(error)
                } else {
                    if (resultado.length == 0) {
                        res.send({code:200, 'mensaje': 'No existe el id' })
                    } else {
                        res.send(resultado)
                    }
                }

            })



        } else {
            let consulta = "SELECT * FROM envios"
            connection.query(consulta, function (error, resultado) {
                if (error) {
                    respuesta = { error: true, codigo: 200, mensaje: 'No existen envios con ese id' }
                } else {
                    respuesta = { error: false, codigo: 200, mensaje: 'Listado de envios', resultado: resultado }
                }
                res.send(respuesta)

            })
        }
    }
);

app.post("/envios",rutasProtegidas,
    function (req, res) {

        let articulo = req.body.articulo
        let cantidad = req.body.cantidad
        let precio = req.body.precio
    
        let params = [articulo,cantidad,precio]
        let sqlInsertAl = "INSERT INTO envios (articulo,cantidad,precio) VALUES (?,?,?)"
        connection.query(sqlInsertAl, params, function (error, resultado) {

            if (error) {
                if (error.code == "ER_BAD_NULL_ERROR") {
                    res.send({ 'mensaje': 'No puedes introducir un valor nulo' })
                }
                else response.send(error)
            } else {
                res.send({ 'mensaje': 'Envio añadido' })
            }
        })

    }


)

app.put("/envios",rutasProtegidas,
    function (req, res) {
        let articulo = req.body.articulo
        let cantidad = req.body.cantidad
        let precio = req.body.precio
        let id_envio = req.body.id_envio
        let params = [articulo, cantidad, precio, id_envio]
        if (req.body.id_envio == null) {
            res.send({ "mensaje": "Introduce un id" })
        } else {



            let sqlInsertAl = 'UPDATE envios SET articulo = COALESCE(?,articulo),cantidad = COALESCE(?,cantidad),precio = COALESCE(?,precio) WHERE id_envio=?'

            connection.query(sqlInsertAl, params, function (error, resultado) {

                if (error)
                {
                   
                    res.send(error)
                    
                } else {
                    if (resultado.affectedRows == 0) {
                        res.send({ 'mensaje': 'No existe el id' })
                    } else {
                        res.send({ "mensaje": 'envio modificado' })
                    }
                }

            })

        }

    }
)

app.delete("/envios",rutasProtegidas,
    function (req, res) {
        let id_envio = req.body.id_envio;
        let params = [id_envio]
        let consulta = "DELETE FROM envios WHERE id_envio=?"
        connection.query(consulta, params, function (error, resultado) {
            if (error) {

                res.send(error)
            } else {
                if (resultado.affectedRows == 0) {
                    res.send({ 'mensaje': 'No existe el id' })
                } else {
                    res.send({ "mensaje": 'Envio borrado' })
                }
            }
        })



    }
)

module.exports=app