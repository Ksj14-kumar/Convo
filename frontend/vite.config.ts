import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define:{
    "process.env":{
      BACKEND_URL:"http://localhost:8080"
    }
  },
  // server:{
  //   proxy:{
  //     "/api":{
  //       target:"http//localhost:8080",
  //       changeOrigin:true
  //     }
  //   }
  // }
})
