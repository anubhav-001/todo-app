export function validateName(str){
    const regex = /^[a-zA-Z]{2,30}$/;
    return (regex.test(str) ? "" : "Invalid Name");
}