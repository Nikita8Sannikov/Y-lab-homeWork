import {User} from './types/types'

  export const mockFetch = (url: string, email: string, password: string, users: User[],  setUsers: React.Dispatch<React.SetStateAction<User[]>> ) => {
    return new Promise<Response>((resolve, reject) => {
      setTimeout(() => {
        if (url === "/login") {
          const user = users.find(u => u.email === email && u.password === password);
          if (user) {
            resolve(
              new Response(
                JSON.stringify({ message: "Login successful!" }),
                { status: 200 }
              )
            )
          } else if (!users.find(u => u.email === email)) {
            reject(
              new Response(
                JSON.stringify({ message: "Email not found." }),
                { status: 404 }
              )
            )
          } else {
            reject(
              new Response(
                JSON.stringify({ message: "Incorrect password." }),
                { status: 401 }
              )
            )
          }
        } else if (url === "/register") {
          const existingUser = users.find(u => u.email === email);
          if (existingUser) {
            reject(
              new Response(
                JSON.stringify({ message: "Email is already in use." }),
                { status: 409 } 
              )
            )
          } else {
            setUsers(prevUsers => [
              ...prevUsers, 
              { email, password }
            ]);
            resolve(
              new Response(
                JSON.stringify({ message: "Registration successful!" }),
                { status: 201 }
              )
            )
          }
        } else {
          reject(
            new Response(
              JSON.stringify({ message: "Invalid endpoint." }),
              { status: 404 }
            )
          )
        }
      }, 1000);
    })
  }