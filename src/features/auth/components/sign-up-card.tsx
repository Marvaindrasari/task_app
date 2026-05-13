"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import Link from "next/link";
//import { FcGoogle } from "react-icons/fc";
//import { FaGoogle } from "react-icons/fa";
//download dulu packagenya
//<FcGoogle className="mr-2 size-5"></FcGoogle> masukin habis button google
//<FaGoogle className="mr-2 size-5"></FaGoogle> masukin habis button github

import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { registerSchema } from "../schemas";
import { useRegister } from "../api/use-register";


export const SignUpCard = () => {
    const {mutate, isPending} = useRegister();

    const form = useForm<z.infer<typeof registerSchema>>({
            resolver: zodResolver(registerSchema),
            defaultValues:{
                name: "",
                email: "",
                password: "",
            }
        });

    const onSubmit = (values: z.infer<typeof registerSchema>)=> {
        mutate({ json: values });
    }
    
    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Register Here!!
                </CardTitle>
                <CardDescription>
                    By signing up, you agree to our{" "}
                    <Link href="/privacy">
                        <span className="text-blue-700">Privacy Policy</span>
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms">
                        <span className="text-blue-700">Terms and Service</span>
                    </Link>{" "}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >
                        <FormField name="name" control={form.control} render={({ field })=> (
                            <FormItem>
                                <FormControl>
                                    <Input
                                    {...field}
                                    type="text"
                                    placeholder="Enter your name"
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} />
                        <FormField name="email" control={form.control} render={({ field })=> (
                            <FormItem>
                                <FormControl>
                                    <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email"
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} />
                        <FormField name="password" control={form.control} render={({ field })=> (
                            <FormItem>
                                <FormControl>
                                    <Input
                                    {...field}
                                    type="password"
                                    placeholder="Enter password"
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} />
                        <Button disabled={isPending} size="lg" className="w-full">
                            SIgn Up
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardContent className="p-7 flex items-center justify-center">
                <p>
                    Alredy have an acoount?
                    <Link href="/sign-in">
                        <span className="text-blue-700">&nbsp;Login here</span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};