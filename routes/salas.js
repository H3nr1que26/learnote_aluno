const express = require('express');
const router = express.Router();
const mysql = require('./mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');


router.get('/', login.obrigatorio, (req, res, next) => {
   console.log("REQu: " + req.usu_usuario.usu_codigo);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error2: error }) }
        conn.query("select sal_nome,per_descricao,usu_nome,usu_status from perf_perfilsala inner join usu_usuario on usu_usuario.usu_codigo = perf_perfilsala.Usuario_Id inner join sal_sala on sal_sala.sal_codigo = perf_perfilsala.Sala_codigo inner join per_perfil on per_perfil.per_codigo = perf_perfilsala.Perfil_codigo where usu_codigo = ?;", [req.usu_usuario.usu_codigo],
            (error, results) => {
                if (error) { return res.status(500).send({ error2: error }) }
                const response = {
                    salas: results.map(salas => {

                        return {
                            sala: salas.sal_nome,
                            perfil:salas.per_descricao,
                            aluno: salas.usu_nome,
                            status: salas.usu_status
                        }
                    })
                }
                
                return res.status(200).send(response);

            }
        )
    })
})

module.exports = router;