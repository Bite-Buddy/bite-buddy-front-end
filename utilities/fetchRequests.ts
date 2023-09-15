//configure your .env.local file with the server domain link
//REMOVE THE TRAILING SLASH (/) FROM THE URL IN YOUR .env.local FILE
//const DOMAIN = process.env.BACKEND_URL;

// use http and ip address instead of localhost
const DOMAIN = process.env.DOMAIN
import { supabase } from "../supabaseService";
import { IKitchen, IUser, IFood, IFoodRequest, IInvite } from "./interfaces";
// const DOMAIN = "http://localhost:8080";

//
//User fetch requests
//

export async function createUser(supabase_id: string, email: string): Promise<IUser> {
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

export async function getByEmail(email: string): Promise<IUser> {
  try {
    const response = await fetch(`${DOMAIN}/users/email/${email}`, {
      method: "GET",
    })
    return response.json();
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addKitchenRelationship(id: number, kitchen_id: number): Promise<IUser> {
  try {
    const response = await fetch(`${DOMAIN}/users/kitchens`, {
      method: "PATCH",
      body: JSON.stringify({
        id: id,
        kitchen_id: kitchen_id,
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

/**
 * When we delete a user from our database we will probably want 
 * to delete them from supabase user store as well.
 * This function will likely do both operations at the same time
 * in the future.
 */

export async function deleteUserFromDatabase(id: number): Promise<IUser> {
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

//
//Kitchen fetch requests
//

export async function createKitchen(id: number, name: string): Promise<{ message: string, kitchen: IKitchen }> {
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

export async function deleteKitchenById(kitchenId: number): Promise<{ message: string, kitchenResponse: IKitchen }> {
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

export async function updateKitchenById(kitchenId: number, name: string): Promise<{ message: string, kitchenResponse: IKitchen }> {
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

export async function getUsersByKitchen(id: number): Promise<IKitchen> {
  try {
    const response = await fetch(`${DOMAIN}/kitchens/users/${id}`, {
      method: "GET",
    });
    return response.json();
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addUserRelationship(id: number, user_id: number): Promise<IKitchen> {
  try {
    const response = await fetch(`${DOMAIN}/kitchens/users`, {
      method: "PATCH",
      body: JSON.stringify({
        id: id,
        user_id: user_id,
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

//
//Food fetch requests
//

export async function createFood(kitchenId: number, food: IFoodRequest): Promise<{ message: string, food: IFood }> {
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

export async function updateFoodById(foodId: string, food: IFoodRequest): Promise<{ message: string, foodResponse: IFood }> {
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

export async function deleteFoodById(foodId: string): Promise<{message: string, foodResponse: IFood}> {
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

//
//Invite fetch requests
//

export async function createInvite(kitchenId: number, recipientEmail: string): Promise<{message: string, invite: IInvite}> {
  try {
    const response = await fetch(`${DOMAIN}/invites/users`, {
      method: "POST",
      body: JSON.stringify({
        kitchenId: kitchenId,
        recipientEmail: recipientEmail
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


export async function deleteInvite(inviteId: number): Promise<{message: string, inviteResponse: IInvite}> {
  try {
    const response = await fetch(`${DOMAIN}/invites/users/reject`, {
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
    console.error(error);
    throw error;
  }
}

export async function acceptInvite(inviteId: number): Promise<{message: string, inviteResponse: IInvite}> {
  try {
    const response = await fetch(`${DOMAIN}/invites/users/accept`, {
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
    console.error(error);
    throw error;
  }
}

//This is the fetch request to spoonacular with barcode UPC code

const query = {apiKey: process.env.SPOONACULAR_APIKEY!}
const params = new URLSearchParams(query)

export async function searchByBarcode(barcode: number) {
    try {
        const response = await fetch(process.env.SPOONACULAR_URL! + barcode + `?${params}`)
        return response.json()
        }
    catch (error) {
        console.error(error);
        return false;
    }
}
