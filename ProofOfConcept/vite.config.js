import { defineConfig } from "vite"
import dotenv from "dotenv"

dotenv.config()

export default defineConfig({
    plugins: [],
    define: {
        'process.env': process.env
    }
})