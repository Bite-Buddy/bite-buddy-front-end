//configure your .env.local file with the server domain link
//REMOVE THE TRAILING SLASH (/) FROM THE URL IN YOUR .env.local FILE
const DOMAIN = process.env.DOMAIN;

// use http and ip address instead of localhost
// const domain = "http://192.168.10.108:8000"; //park local server

export async function createUser(supabase_id: string, email: string):Promise<Response> {
  const response = await fetch(`${DOMAIN}/users`, {
    method: "POST",
    body: JSON.stringify({
      supabase_id: supabase_id,
      email: email,
    }),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function getUsers():Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/users`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });
    const resolved = await response.json();
    return resolved;
  }
  catch(error) {
    console.error(error);
    throw error;
  }
}

export async function getBySupabaseID(supabase_id: string):Promise<Response> {
  const response = await fetch(`${DOMAIN}/users/:${supabase_id}`, {
    method: "GET",
  });
  return response.json();
}

async function createFood() {

}







//testing
async function getUserInfo(id: string) {
  const response = await fetch("");
  return response.json();
}