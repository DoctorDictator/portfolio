"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Title from "@/components/ui/Title";
import { bricolage_grotesque } from "@/utils/fonts";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Incorrect username or password");
        } else {
          toast.error(result.error);
        }
      }

      if (result?.url) {
        toast.success("Login Successful :)");
        router.replace("/blogs/add");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={`min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-zinc-900 dark:to-zinc-800 ${bricolage_grotesque}`}
    >
      <div className="bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl flex flex-col gap-6 border border-gray-200 dark:border-zinc-800 m-0 p-0 overflow-hidden">
        <div className="flex flex-col items-center gap-2 p-10 pb-0">
          <Title title="Login" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Welcome back! Please sign in to continue.
          </p>
        </div>
        <form
          className="flex flex-col gap-5 mt-2 px-10"
          onSubmit={loginUser}
          autoComplete="off"
        >
          <div>
            <label
              className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              className="w-full border rounded-md px-3 py-2 dark:bg-zinc-800 dark:text-white"
              placeholder="johndoe69@xyz.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              className="w-full border rounded-md px-3 py-2 dark:bg-zinc-800 dark:text-white"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-md py-2 hover:bg-gray-900 dark:hover:bg-gray-200 transition"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2 pb-10"></div>
      </div>
    </section>
  );
}
