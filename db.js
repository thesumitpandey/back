

const mongoose=require('mongoose');
const mogoURI="mongodb+srv://thesumitpandey:sumit80390@cluster0.o61u2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



async function connectToMongo() {
  await mongoose.connect(mogoURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
}

module.exports = connectToMongo;