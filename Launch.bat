cd server
:: Checks if a react build exists in public folder
if not exist public\build\ (
  if not exist \node_modules\ (
    npm i
  )
  if not exist ..\webapp\node_modules (
    cd ..\webapp
    npm i
    cd ..\server
  )
  npm run build
)
:: Starts the client and server
npm run server
