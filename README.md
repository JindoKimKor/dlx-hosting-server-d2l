# DLX Server

### Using the Server Locally

- Setup `.env` file with the relevant variables

  DB_HOST= *your_mongodb_url*
  LTI_KEY= *Random string (This can be anything)*
  PORT= *3000*
  URL= *your_ngrok_domain*
  REG_NAME= *your_external_tool_name*
  CLIENT_ID= *your_external_tool_client_id*
  LOG_DIR= *Directory path where you want to save log files*
  
- Run `npm install`
- Run `npm start`
- Run `ngrok http --domain [your_ngrok_url] [your_port_number]` in another terminal

### Creating External Tool

- Go to [vConestoga Moodle](https://vconestoga.duckdns.org) and login
- Go to **Site administration - Plugins - External tool - Manage tools**
- Enter **your_ngrok_url/register** in the tool URL field
- Click **Add LTI Advantage**
- Click **Activate** button
- Set the environment variable **REG_NAME** and **CLIENT_ID** with your tool's
