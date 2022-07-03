// let os = window.require( 'os' )

// const networkInterfaces = os.networkInterfaces();
// console.log(networkInterfaces)
// const ip = networkInterfaces['Wi-Fi'][1]['address']

// console.log(ip);

const ip="192.168.1.4"

export const LocalServerUrl = 'http://localhost:5000'
export const LanServerUrl = `http://${ip}:5000`
export const TetheredServerUrl = 'http://192.168.43.250:5000'
export const GlobalServerUrl = 'http://_._._._:5000'

export const LocalSourceUrl = 'http://localhost:3000'
export const LanSourceUrl = 'http://192.168.22.202:5000'
export const TetheredSourceUrl = 'http://192.168.43.250:3000'
export const GlobalSourceUrl = 'http://_._._._:3000'

export const ApiBaseUrl = LanServerUrl
export const SourceBaseUrl = LanServerUrl
