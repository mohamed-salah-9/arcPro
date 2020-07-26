const mongoose = require('mongoose')
 

// mongoose.connect('mongodb://admin:ZOmdU2QXWwWVQYGq@SG-Arcland-33882.servers.mongodirector.com:27017/admin',  {
 mongoose.connect('mongodb://127.0.0.1:27017/ArclandApi',  {

useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
 }).then(() => console.log('DB Connected!'))
 .catch(err => {
 console.log(  err.message);
 });
// var options = {
//     server: { sslCA: certFileBuf }
//   };