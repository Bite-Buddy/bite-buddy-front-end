//configure your .env.local file with the server domain link
//REMOVE THE TRAILING SLASH (/) FROM THE URL IN YOUR .env.local FILE
const DOMAIN = process.env.DOMAIN;

// use http and ip address instead of localhost
// const DOMAIN = "http://192.168.1.226:8080"; //park local server
import { IKitchen, IUser, IFood, IFoodRequest } from "./interfaces";
// const DOMAIN = "http://localhost:8080";

export async function createUser(supabase_id: string, email: string):Promise<IUser> {
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
    console.error(error);
    console.log("CREATE USER ERROR");
    throw error;
  }
}

export async function getUsers(): Promise<IUser[]> {
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

export async function getBySupabaseID(supabase_id: string): Promise<IUser> {
  try {
    const response = await fetch(`${DOMAIN}/users/supabase/${supabase_id}`, {
      method: "GET",
    });
    return response.json();
  }
  catch (error) {
    console.error(error);
    console.log("GET BY SUPABASE ID");
    throw error;
  }
}

export async function getByDatabaseID(id: string): Promise<IUser> {
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
export async function deleteUserFromDatabase(id: string): Promise<IUser> {
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

export async function createKitchen(id: number, name: string): Promise<{message: string, kitchen: IKitchen}> {
  try {
    console.log('calling with arugments', id, name, `${DOMAIN}/kitchens/users/${id}`)
    const response = await fetch(`${DOMAIN}/kitchens/users/${id}`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
      }),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getKitchens(): Promise<IKitchen[]> {
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

export async function getKitchenByID(kitchenId: number): Promise<IKitchen> {
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

export async function createFood(kitchenId: number, food: IFoodRequest): Promise<{message: string, food: IFood}> {
  try {
    const response = await fetch(`${DOMAIN}/kitchens/${kitchenId}/foods`, {
      method: "POST",
      body: JSON.stringify({
        ...food,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
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
export async function getAllFood(): Promise<IFood[]> {
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
export async function getFoodByID(id: string): Promise<IFood> {
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

export async function updateFoodById(foodId: string, food: IFoodRequest): Promise<{message: string, foodResponse: IFood}> {
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

export async function updateKitchenById(kitchenId: number, name: string): Promise<{message: string, kitchenResponse: IKitchen}> {
  try {
    const response = await fetch(`${DOMAIN}/kitchens/${kitchenId}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: name
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

export async function deleteFoodById(foodId: string): Promise<IFood> {
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

export async function deleteKitchenById(kitchenId: number): Promise<{message: string, kitchenResponse: IKitchen}> {
  try {
    const response = await fetch(`${DOMAIN}/kitchens/${kitchenId}`, {
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
