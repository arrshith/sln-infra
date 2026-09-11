import { projects } from "./content";

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  project: string;
  message: string;
  consent: boolean;
  website: string;
};

export function validateEnquiry(
  value: unknown,
): { data: Enquiry } | { error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return { error: "Please check your enquiry details." };
  const input = value as Record<string, unknown>;
  for (const field of [
    "name",
    "phone",
    "email",
    "project",
    "message",
    "website",
  ]) {
    if (typeof input[field] !== "string")
      return { error: "Please complete the required fields." };
  }
  const data: Enquiry = {
    name: (input.name as string).trim(),
    phone: (input.phone as string).trim(),
    email: (input.email as string).trim(),
    project: (input.project as string).trim(),
    message: (input.message as string).trim(),
    website: (input.website as string).trim(),
    consent: input.consent === true,
  };
  if (data.website)
    return {
      error:
        "We couldn’t process this enquiry. Please contact us by phone or email.",
    };
  if (
    data.name.length < 2 ||
    data.name.length > 100 ||
    /[\r\n]/.test(data.name)
  )
    return { error: "Enter your name, between 2 and 100 characters." };
  if (
    !/^[+\d\s().-]+$/.test(data.phone) ||
    data.phone.replace(/\D/g, "").length < 8 ||
    data.phone.replace(/\D/g, "").length > 15 ||
    data.phone.length > 30
  )
    return {
      error: "Enter a valid phone number, including your country code.",
    };
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return { error: "Enter a valid email address." };
  if (data.project && !projects.some((p) => p.slug === data.project))
    return { error: "Choose a project from the list." };
  if (data.message.length > 2000)
    return { error: "Keep your message within 2,000 characters." };
  if (!data.consent)
    return { error: "Please agree to being contacted about your enquiry." };
  return { data };
}
