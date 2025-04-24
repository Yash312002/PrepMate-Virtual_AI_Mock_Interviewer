"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust for cross-origin //
  });
  console.log("Session cookie set in browser."); //
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists){
      console.log("User already exists in Firestore for UID:", uid); //
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }
     
    // save user to db
    console.log("Saving user to Firestore with UID:", uid); //
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });
    console.log("User saved to Firestore successfully."); //
    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    console.log("Setting session cookie..."); //
    await setSessionCookie(idToken);
    console.log("Session cookie set successfully.");//
  } catch (error: any) {
    console.log(error);
    console.error("Error in signIn:", error); //
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  console.log("Session cookie: ", sessionCookie);
  if (!sessionCookie) {
    console.log("No session cookie found.");
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    console.log("Decoded claims:", decodedClaims);
    
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
      
    if (!userRecord.exists) {
      console.log("User not found in Firestore for UID:", decodedClaims.uid);
      return null;
    }

    const userData = userRecord.data();
    console.log("User found in Firestore:", userData);
    
    return {
      ...userData,
      id: userRecord.id,
      name: userData?.name || decodedClaims.name,
      email: userData?.email || decodedClaims.email,
      profileURL: userData?.profileURL || null,
      resumeURL: userData?.resumeURL || null
    } as User;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export const updateUserProfile = async (userId: string, data: { profileURL?: string, resumeURL?: string }) => {
  try {
    console.log('Updating user profile:', { userId, data }); // Add logging
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    console.log('Profile updated successfully'); // Add logging
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}