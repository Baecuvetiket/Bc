# BaecUvStore E-Ticaret Projesi

## Deploy Öncesi
1. `.env` dosyası oluşturun ve aşağıdaki değişkenleri doldurun:
   - `DATABASE_URL=postgres://kullanici:sifre@host:port/db`
   - `JWT_SECRET=guclu-bir-secret`

2. Veritabanı tablolarını oluşturmak için:
   ```
   npm run db:push
   ```

## Build & Deploy
- **Build:**
  ```
  npm install && npm run build
  ```
- **Start (Production):**
  ```
  npm start
  ```

## Render İçin Notlar
- Ortam değişkenlerini Render panelinden ekleyin.
- PostgreSQL servisini Render üzerinden oluşturup bağlantı adresini kullanın. 