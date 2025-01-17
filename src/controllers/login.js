const { PrismaClient } = require("@prisma/client");
const { verify } = require("argon2");
const { response } = require("express");
const { request } = require("express");
const prisma = new PrismaClient();

exports.login = async (req = request, res = response) => {
  const { correo, clave } = req.body;

  const usuario = await prisma.clientes.findUnique({
    where: {
      correo: correo,
    },
  });
  console.log(usuario);

  if (!usuario) {
    res.render("login", { error: "Credeciales Incorrectas" });
    return;
  }

  let valido = verify(usuario.clave, clave);

  if (!valido) {
    res.render("login", { error: "Credenciales Incorrectas" });
    return;
  }
  req.session.userid = usuario.id;
  res.app.locals.username = usuario.nombre;
  res.redirect("/mapa");
};
