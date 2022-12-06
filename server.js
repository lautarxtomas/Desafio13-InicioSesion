const path = require('path');
const express = require('express');
const session = require('express-session')
const { engine } = require('express-handlebars');
const router = require('./src/routes/router');
const cookieParser = require('cookie-parser');

const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const ContenedorProductos = require('./src/class/Products')
const ContenedorMensajes = require('./src/class/Messages')

const routerProductos = require('./src/routes/productos')


/* --- Instancias  ---- */

const controllerProductos = new ContenedorProductos()
const controllerMensajes = new ContenedorMensajes()


/* ------ Socket.io ------ */

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const app = express();

app.use(session({ 
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://lautarxtomas:lautaro123@cluster0.xpais9l.mongodb.net/ecommerce?retryWrites=true&w=majority' || 'mongodb://localhost/ecommerce',
        mongoOptions: advancedOptions,
        collectionName: 'sessions'
    }),
    secret: 'secret',
    resave: true,
    saveUnitialized: true,
    cookie: { maxAge: 60000 }
}))

const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

/* -------  App  -------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public')); // --> descomentar y comentar las 6 lineas de abajo para probar con HTML (no handlebars), faltan sessions

app.use(cookieParser())
app.use(router)
app.use(express.static('views'));
app.engine('handlebars', engine())
app.set('views', './views');
app.set('view engine', 'handlebars')


io.on('connection', async socket => {

    console.log('Se conectó un nuevo cliente');

    // Productos
    socket.emit('productos', await controllerProductos.getRandom());

    // Mensajes
    socket.emit('mensajes', await controllerMensajes.getAll());

    socket.on('new-message', async mensaje => {

        await controllerMensajes.save(mensaje)
        io.sockets.emit('mensajes', await controllerMensajes.getAll());
    })
});




/* -------  Rutas  -------- */

app.use('/api/productos-test', routerProductos) // --> esta ruta trae 5 productos random de faker js. Despues se fetchea en el index.js y se renderizan los productos.

app.get('/info', (req, res) => {
    if (req.session.contador) {
        req.session.contador++
        res.send(`Usted ha visitado el sitio ${req.session.contador} veces.`)
    } else {
        req.session.contador = 1
        res.send('Bienvenido!')
    }
})

app.get('/sessions', (req, res) => {
    res.json(req.session)
})


/* -------  Server  -------- */

const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => console.log(`Servidor http escuchando en el puerto ${server.address().port}`));
server.on('error', error => console.log(`Error en servidor ${error}`));