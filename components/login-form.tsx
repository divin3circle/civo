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
import Image from "next/image";
import { github, google, login, microsoft } from "@/assets";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase.config";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getOrCreateUser } from "@/hooks/use-user";
import { FirebaseError } from "firebase/app";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error((error as FirebaseError).message);
      toast.error("Failed to login, invalid email or password");
      setError("Failed to login, invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
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
        throw new Error("Failed to login with " + provider);
      }

      const userData = await getOrCreateUser(userCredential.user.uid, {
        email: userCredential.user.email || "",
        name: userCredential.user.displayName || "",
        photoUrl: userCredential.user.photoURL || "",
        currency: "KES",
      });

      if (!userData) {
        throw new Error("Failed to initialize user data");
      }

      const isNewUser = !userData.onboarded;
      if (isNewUser) {
        toast.success("Account created! Welcome to Civo");
      } else {
        toast.success("Welcome back " + userCredential.user.displayName);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error((error as Error).message);
      toast.error("Failed to login with " + provider.toUpperCase());
      setError(
        "Failed to login with " +
          provider.toUpperCase() +
          ", " +
          (error as Error).message
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6 font-sans", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Civo account
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
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel
                    htmlFor="password"
                    className="font-sans font-semibold"
                  >
                    Password
                  </FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm font-sans underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="font-sans border border-foreground/30 rounded-3xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button
                  disabled={loading}
                  type="submit"
                  className="font-semibold rounded-3xl"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleSubmit(e)
                  }
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>
              </Field>
              {error && (
                <FieldDescription className="text-xs text-destructive">
                  {error}
                </FieldDescription>
              )}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center border-foreground/30 rounded-3xl"
                  disabled={loading}
                  onClick={() => handleOAuthLogin("microsoft")}
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
                  disabled={loading}
                  onClick={() => handleOAuthLogin("google")}
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
                  disabled={loading}
                  onClick={() => handleOAuthLogin("github")}
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
                Don&apos;t have an account? <a href="/signup">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={login}
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
