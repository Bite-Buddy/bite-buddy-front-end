const domain = "http://localhost:8000";

export async function createUser(supabase_id: string, email: string):Promise<Response> {
  const response = await fetch(`${domain}/users`, {
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
  const response = await fetch(`${domain}/users`, {
    method: "GET",
  });
  return response.json();
}

export async function getBySupabaseID(supabase_id: string):Promise<Response> {
  const response = await fetch(`${domain}/users/:${supabase_id}`, {
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