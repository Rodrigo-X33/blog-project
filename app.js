// Importa los módulos necesarios
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose')

//Conexión con la Base de Datos
mongoose.connect("mongodb+srv://rodrigochacon:11b0Jwf4AdmCIXmr@cluster0.wg7ktnz.mongodb.net/blogProyect");

// Contenido inicial para las páginas
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. ...";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. ...";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. ...";

// Esquema y colección para almacenar los datos
const postSchema = new mongoose.Schema({
  titulo: String,
  contenido: String
})
const Post = mongoose.model("Post", postSchema);
// Configuración de la aplicación Express
const app = express();

app.set('view engine', 'ejs');
app.engine("ejs", require("ejs").__express);
app.set("views", path.join(__dirname, "./views"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Ruta para ver una publicación individual
app.get('/posts/:postName', (req, res)=>{
  const titleUrl = req.params.postName;
  // Busca la publicación por título y renderiza la vista 'post'
  Post.findOne({_id: titleUrl}).then((registro)=>{
    console.log(registro)
    res.render('post', {post: registro})
  })
  // publicaciones.forEach((post)=>{
  //   const storageTitle = _.lowerCase(post.titulo);
  //   if(storageTitle === titleUrl){
  //     res.render('post', {post: post});
  //   }
  // });
});

// Ruta principal para mostrar las publicaciones y contenido inicial
app.get('/', (req, res)=>{
  Post.find({}).then(registros=>{
    console.log(registros);
    res.render('home', {startContent: homeStartingContent, publicaciones: registros});
  })
});

// Rutas para las páginas 'about' y 'contact'
app.get('/about', (req, res)=>{
  res.render('about', {startContent: aboutContent});
});

app.get('/contact', (req, res)=>{
  res.render('contact', {startContent: contactContent});
});

// Ruta para la página de creación de nuevas publicaciones
app.get('/compose', (req, res)=>{
  res.render('compose');
});

// Manejo de la publicación de nuevas entradas
app.post('/compose', (req, res)=>{
  const post = new Post({
    titulo: req.body.titlePubli, 
    contenido: req.body.contentPubli
  });
  // Agrega la nueva publicación a la base de datos y redirige a la página principal
  post.save();
  res.redirect('/');
});

// Inicia el servidor en el puerto 3000
app.listen(process.env.PORT || 3000, ()=>{
  console.log("Server started on port 3000");
});
