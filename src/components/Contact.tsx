"use client";

import React, { useState } from "react";
import { bricolage_grotesque } from "@/utils/fonts";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/project";
import { toast } from "sonner";

import Title from "./ui/Title";

const Contact = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isEmailSending, setIsEmailSending] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendEmailMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsEmailSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-email", {
        email,
        message,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail("");
        setMessage("");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.message);
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className="w-full px-64 max-[1285px]:px-52 max-lg:px-4 max-sm:px-2 flex flex-col items-center mt-6 pb-8">
      <Title title="Get in Touch" />

      <div
        className={`w-full flex flex-col gap-3 mt-6 px-36 max-sm:px-4 ${bricolage_grotesque}`}
      >
        <div className="mt-6">
          <h2 className="text-lg text-start max-sm:text-base">
            Reach Out via Email
          </h2>
        </div>

        <div className="w-full flex justify-center">
          <div className="mt-4 w-full">
            <form className="flex flex-col gap-4" onSubmit={sendEmailMessage}>
              <div className="grid w-full gap-2">
                <Label htmlFor="message">Your Email</Label>
                <Input
                  type="text"
                  className="w-full h-full border"
                  placeholder="johndoe69@xyz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="message">Your message</Label>
                <Textarea
                  placeholder="Type your message here."
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={5}
                />
              </div>
              <Button className="mt-3">
                {isEmailSending ? "Sending Message..." : "Send message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
