"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { microsoft, google, github, register } from "@/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  GithubAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { generateUserId, isValidUsername, saveNewUser } from "@/hooks/use-user";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setError("Passwords do not match");
      return;
    }

    if (!isValidUsername(userName)) {
      toast.error("Invalid username");
      setError(
        "Invalid username, must be 3-20 characters long and only contain letters and numbers"
      );
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      await saveNewUser(generateUserId(), {
        email: email,
        name: userName,
        photoUrl: "",
        homeLocation: "",
        dietType: "",
        currency: "KES",
        walletAddress: "",
        totalCO2Saved: "0",
        streak: "0",
        longestStreak: "0",
        lastLoggedDate: "",
        onboarded: true,
        createdAt: new Date().toISOString(),
        badge100Kg: false,
        badge30Day: false,
        badgeHero: false,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error((error as Error).message);
      toast.error("Failed to create account");
      setError(
        "Failed to create account, " + (error as Error).message ||
          "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: string) => {
    let providerInstance:
      | OAuthProvider
      | GoogleAuthProvider
      | GithubAuthProvider;
    switch (provider.toLowerCase()) {
      case "google":
        providerInstance = new GoogleAuthProvider();
        break;
      case "github":
        providerInstance = new GithubAuthProvider();
        break;
      default:
        providerInstance = new OAuthProvider("microsoft.com");
        break;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, providerInstance);

      if (!userCredential.user) {
        throw new Error("Failed to sign up with " + provider);
      }
      await saveNewUser(userCredential.user.uid, {
        email: userCredential.user.email || "",
        name: userCredential.user.displayName || "",
        photoUrl: userCredential.user.photoURL || "",
        homeLocation: "",
        dietType: "",
        currency: "KES",
        walletAddress: "",
        totalCO2Saved: "0",
        streak: "0",
        longestStreak: "0",
        lastLoggedDate: "",
        onboarded: true,
        createdAt: new Date().toISOString(),
        badge100Kg: false,
        badge30Day: false,
        badgeHero: false,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error((error as Error).message);
      toast.error("Failed to sign up with " + provider.toUpperCase());
      setError(
        "Failed to sign up with " +
          provider.toUpperCase() +
          ", " +
          (error as Error).message || "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 font-sans", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-semibold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email" className="font-sans font-semibold">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="font-sans border border-foreground/30 rounded-3xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FieldDescription className="text-xs text-muted-foreground">
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="username"
                  className="font-sans font-semibold"
                >
                  Username
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Sylus"
                  required
                  className="font-sans border border-foreground/30 rounded-3xl"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <FieldDescription className="text-xs text-muted-foreground">
                  Your username will be used to identify you in the app.
                </FieldDescription>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="password"
                      className="font-sans font-semibold"
                    >
                      Password
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      className="font-sans border border-foreground/30 rounded-3xl"
                      value={password}
                      onChange={(e) => {
                        setError("");
                        setPassword(e.target.value);
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel
                      htmlFor="confirm-password"
                      className="font-sans font-semibold"
                    >
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      className="font-sans border border-foreground/30 rounded-3xl"
                      value={confirmPassword}
                      onChange={(e) => {
                        setError("");
                        setConfirmPassword(e.target.value);
                      }}
                    />
                  </Field>
                </Field>
                <FieldDescription className="text-xs text-muted-foreground">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              {error && (
                <FieldDescription className="text-xs text-destructive">
                  {error}
                </FieldDescription>
              )}
              <Field>
                <Button
                  disabled={loading}
                  type="submit"
                  className="font-semibold rounded-3xl"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center border-foreground/30 rounded-3xl"
                  onClick={() => handleOAuthSignUp("microsoft")}
                  disabled={loading}
                >
                  <Image
                    src={microsoft}
                    alt="Microsoft"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="sr-only">Login with Microsoft</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center border-foreground/30 rounded-3xl"
                  onClick={() => handleOAuthSignUp("google")}
                  disabled={loading}
                >
                  <Image
                    src={google}
                    alt="Google"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center border-foreground/30 rounded-3xl"
                  onClick={() => handleOAuthSignUp("github")}
                  disabled={loading}
                >
                  <Image
                    src={github}
                    alt="GitHub"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="sr-only">Login with GitHub</span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={register}
              alt="Image"
              width={500}
              height={500}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
