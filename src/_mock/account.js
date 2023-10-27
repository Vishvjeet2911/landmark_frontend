import CryptoJS from "crypto-js";
let account = {}
try {
    const bundle = localStorage.getItem("lm_bundle")
    if (bundle != null) {
        const bytes = CryptoJS.AES.decrypt(bundle, process.env.REACT_APP_SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        account = decryptedData
    } else {

    }
}
catch (err) {
    localStorage.removeItem('lm_token')
    localStorage.removeItem('lm_bundle')
    window.open('/')
}

export default account;