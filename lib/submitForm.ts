import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";


interface FormData {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  contact: string;
}

interface FormSubmitResult {
  success: boolean;
  error?: string;
}

export async function submitForm(data: FormData): Promise<FormSubmitResult> {
  try {
    const collectionRef = collection(db, "formResponses");

    // Add timestamp to track submissions
    const doc = {
      ...data,
      submittedAt: new Date().toISOString(),
    };

    await addDoc(collectionRef, doc);
    return { success: true };
  } catch (error: unknown) {
    let errorMessage = "Unknown error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error saving form:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
