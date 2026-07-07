import  app  from './src/app.js'
import connectDB from './src/database/database.js';
import config from './src/config/config.js'
connectDB()
app.listen(config.PORT || 3000,()=>{
    console.log(`Server is running on port ${config.PORT}`);
})