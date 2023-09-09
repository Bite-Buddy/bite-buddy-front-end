//configure your .env.local file with the server domain link
//REMOVE THE TRAILING SLASH (/) FROM THE URL IN YOUR .env.local FILE
// const DOMAIN = process.env.DOMAIN;

// use http and ip address instead of localhost
// const DOMAIN = "http://192.168.1.226:8080"; //park local server
const DOMAIN = "http://localhost:8080";

export async function createUser(supabase_id: string, email: string): Promise<Response> {
  try {
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
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }
  catch (error) {
    throw error;
  }
}

export async function getUsers(): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/users`, {
      method: "GET",
    });
    return response.json();
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getBySupabaseID(supabase_id: string): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/users/supabase/${supabase_id}`, {
      method: "GET",
    });
    return response.json();
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getByDatabaseID(id: string): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/users/${id}`, {
      method: "GET",
    });
    return response.json();
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * When we delete a user from our database we will probably want 
 * to delete them from supabase user store as well.
 * This function will likely do both operations at the same time
 * in the future.
 */
export async function deleteUserFromDatabase(id: string): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/users/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createKitchen(id: string): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/kitchens/users/${id}`, {
      method: "POST",
    });
    return response.json();
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getKitchens(): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/kitchens`, {
      method: "GET",
    });
    return response.json();
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getKitchenByID(kitchenId: string): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/kitchens/${kitchenId}`, {
      method: "GET",
    })
    return response.json();
  }
  catch (error) {
    throw error;
  }
}

interface IFood {
  name: string,
  bought_on: Date,
  updated_on: Date,
  inStock: boolean,
}
export async function createFood(kitchenId: string, food: IFood): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/kitchens/${kitchenId}/foods`, {
      method: "POST",
      body: JSON.stringify({
        ...food,
      }),
    });
    return response.json();
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}
/**
 * We probably aren't going to need this on production
 * Will be useful for testing
 */
export async function getAllFood(): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/foods`, {
      method: "GET",
    });
    return response.json();
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * We probably aren't going to need this on production
 * Will be useful for testing
 */
export async function getFoodByID(id: string): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/foods/${id}`, {
      method: "GET",
    });
    return response.json();
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateFoodById(foodId: string, food: IFood): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/foods/${foodId}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...food,
      }),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }
  catch (error) {
    throw error;
  }
}

export async function deleteFoodByID(foodId: string): Promise<Response> {
  try {
    const response = await fetch(`${DOMAIN}/foods/${foodId}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }
  catch (error) {
    throw error;
  }
}
