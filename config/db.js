import mongoose from 'mongoose';

const URL = 'mongodb://localhost:27017/SH-DB';

mongoose.connect(URL).
then( () => console.log('Database connected...')).
catch( err => console.log(err));

export default mongoose.connection;