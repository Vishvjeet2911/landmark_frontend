import CryptoJS from "crypto-js";
let account = {}
try {
    const bundle = localStorage.getItem("lm_bundle")
    if (bundle != null) {
        const bytes = CryptoJS.AES.decrypt(bundle, process.env.REACT_APP_SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        // console.log("bundleeeeeeeeee",decryptedData)
        // account.displayName = decryptedData.username;
        account = decryptedData
        console.log("account : ", account)
        // account.permissions = [
        //     "user_edit", "user_create", "user_view", "user_delete", "task_create", "task_edit", "own_task", "task_view", "task_update", "role_create", "role_edit", "role_view", "role_delete", "city_create", "city_edit", "city_view", "area_create", "area_edit", "area_view", "area_delete", "area_import", "property_create", "property_edit", "property_view", "property_delete", "property_import", "property_export",
        // ]
    } else {

    }
}
catch (err) {
    localStorage.removeItem('lm_token')
    localStorage.removeItem('lm_bundle')
    window.open('/')
}
// console.log(account)

export default account;