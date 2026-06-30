import dotenv from "dotenv"

dotenv.config()


const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT : process.env.JWT,
    GOOGLE_CLINT_ID : process.env.GOOGLE_CLINT_ID,
    GOOGLE_CLINT_SECRET:process.env.GOOGLE_CLINT_SECRET,
    GOOGLE_REFRESH_TOKEN : process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER : process.env.GOOGLE_USER

}

if (!config.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}
if (!config.JWT) {
    throw new Error("JWT is not defined in the environment variables");
}
if (!config.GOOGLE_CLINT_ID) {
    throw new Error("GOOGLE_CLINT_ID is not defined in the environment variables");
}
if (!config.GOOGLE_CLINT_SECRET) {
    throw new Error("GOOGLE_CLINT_SECRET is not defined in the environment variables");
}
if (!config.GOOGLE_REFRESH_TOKEN) {
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined in the environment variables");
}
if (!config.GOOGLE_USER) {
    throw new Error("GOOGLE_USER is not defined in the environment variables");
}

export default config