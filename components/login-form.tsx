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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
                />
              </Field>
              <Field>
                <Button type="submit" className="font-semibold rounded-3xl">
                  Login
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
