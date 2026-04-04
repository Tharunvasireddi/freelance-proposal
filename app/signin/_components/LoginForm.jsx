"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const inputClassName =
  "h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-400 transition focus:border-white/40 focus:outline-none";

const getErrorMessage = (response, fallback) => {
  if (response?.error?.message) return response.error.message;
  return fallback;
};

export default function LoginForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signin");
  const [message, setMessage] = useState(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submitLabel = useMemo(() => {
    return activeTab === "signin" ? "Sign in" : "Create account";
  }, [activeTab]);

  const handleGoogleAuth = async () => {
    try {
      setMessage(null);
      setIsGoogleLoading(true);
      const response = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      console.log(response);

      if (response?.error) {
        setMessage({
          type: "error",
          text: getErrorMessage(
            response,
            "Google sign-in failed. Please try again.",
          ),
        });
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Google sign-in failed. Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      setMessage(null);
      setIsEmailLoading(true);

      const response = await authClient.signIn.email({
        email: signInForm.email,
        password: signInForm.password,
        callbackURL: "/dashboard",
      });

      if (response?.error) {
        setMessage({
          type: "error",
          text: getErrorMessage(
            response,
            "Unable to sign in. Check your credentials.",
          ),
        });
        return;
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Sign-in failed. Please try again.",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    try {
      setMessage(null);
      setIsEmailLoading(true);

      const response = await authClient.signUp.email({
        name: signUpForm.name,
        email: signUpForm.email,
        password: signUpForm.password,
        callbackURL: "/dashboard",
      });

      if (response?.error) {
        setMessage({
          type: "error",
          text: getErrorMessage(
            response,
            "Unable to create account. Please try again.",
          ),
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Account created successfully. You are now signed in.",
      });
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Sign-up failed. Please try again.",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <Card className="w-full border-white/15 bg-zinc-950/80 text-white shadow-2xl shadow-black/30 backdrop-blur">
      <CardHeader className="space-y-2 pb-2 sm:space-y-3">
        <CardTitle className="text-2xl sm:text-3xl">Welcome back</CardTitle>
        <p className="text-sm text-zinc-300">
          Use email/password or continue with Google.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid h-11 w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className={"pt-3"}>
            <form className="space-y-3" onSubmit={handleSignIn}>
              <div className="space-y-1">
                <label
                  className="text-xs font-medium text-zinc-300"
                  htmlFor="signin-email"
                >
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  className={inputClassName}
                  value={signInForm.email}
                  onChange={(event) =>
                    setSignInForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <label
                  className="text-xs font-medium text-zinc-300"
                  htmlFor="signin-password"
                >
                  Password
                </label>
                <input
                  id="signin-password"
                  type="password"
                  className={inputClassName}
                  value={signInForm.password}
                  onChange={(event) =>
                    setSignInForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="h-11 w-full bg-white text-black hover:bg-zinc-200"
                disabled={isEmailLoading || isGoogleLoading}
              >
                {isEmailLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    {submitLabel}
                    <ArrowRight />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="pt-3">
            <form className="space-y-3" onSubmit={handleSignUp}>
              <div className="space-y-1">
                <label
                  className="text-xs font-medium text-zinc-300"
                  htmlFor="signup-name"
                >
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  className={inputClassName}
                  value={signUpForm.name}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-1">
                <label
                  className="text-xs font-medium text-zinc-300"
                  htmlFor="signup-email"
                >
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  className={inputClassName}
                  value={signUpForm.email}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <label
                  className="text-xs font-medium text-zinc-300"
                  htmlFor="signup-password"
                >
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  className={inputClassName}
                  value={signUpForm.password}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                className="h-11 w-full bg-white text-black hover:bg-zinc-200"
                disabled={isEmailLoading || isGoogleLoading}
              >
                {isEmailLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    {submitLabel}
                    <ArrowRight />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/15" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-400">
              or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
          onClick={handleGoogleAuth}
          disabled={isGoogleLoading || isEmailLoading}
        >
          {isGoogleLoading ? (
            <>
              <LoaderCircle className="animate-spin" />
              Redirecting...
            </>
          ) : (
            <span className="flex items-center gap-2 text-white">
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </span>
          )}
        </Button>

        {message ? (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-md border px-3 py-2 text-sm ${
              message.type === "error"
                ? "border-red-400/30 bg-red-500/10 text-red-200"
                : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {message.text}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
