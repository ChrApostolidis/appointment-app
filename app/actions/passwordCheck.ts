"use server";

export async function passwordCheck(password: string) {
    const correctPassword = process.env.ADMIN_PASS;
    console.log(correctPassword);
    if (password === correctPassword) {
        return true;
    } else {
        return false;
    }   
}   