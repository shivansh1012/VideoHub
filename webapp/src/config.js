const ipaddr = '192.168.1.11'

export const LocalServerUrl = 'http://localhost:5000'
export const LanServerUrl = `http://${ipaddr}:5000`
export const TetheredServerUrl = 'http://192.168.43.250:5000'
export const GlobalServerUrl = 'http://_._._._:5000'

export const ApiBaseUrl = process.env.NODE_ENV === 'development' ? LanServerUrl : ''
