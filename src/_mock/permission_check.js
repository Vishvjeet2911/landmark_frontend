import account from "./account";

export function permission_check(val) {
    if (account?.permissions?.includes('admin')) {
        return true
    } else if (account?.permissions?.includes(val)) {
        return true
    } else {
        return false
    }
}