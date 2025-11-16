import {api} from "./api";

export async function login(username, password){
    const {data} = await api.post("/auth/login", {username, password});

    localStorage.setItem("access_token", data.token);
    localStorage.setItem("username", data.user.username);

    return data.user;

}

export function logout(){
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");

}

/* 
export async function getMe(){
    const {data} = await api.get("/auth/me");
    return data;
}
    */

export async function register(username, email, password) {

    const {data} = await api.post("/auth/register", {username, email, password});

    return data.message;
    
    
}