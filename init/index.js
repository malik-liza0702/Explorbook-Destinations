const Listing=require("../models/Listing.js")
const mongoose=require("mongoose");
const initData=require("./data.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

main()
.then(()=>{
    console.log("connected to db")

})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

async function initDb(){
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
    // console.log(initData.data);

}
initDb();



