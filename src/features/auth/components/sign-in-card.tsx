"use client";

//import { FcGoogle } from "react-icons/fc";
//import { FaGoogle } from "react-icons/fa";
//download dulu packagenya
//<FcGoogle className="mr-2 size-5"></FcGoogle> masukin habis button google
//<FaGoogle className="mr-2 size-5"></FaGoogle> masukin habis button github

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";

export const SignInCard = () => {
    const { mutate, isPending } = useLogin();

    const form = useForm<z.infer<typeof loginSchema>>({ //memastikan tipe data form sesuai dengan loginSchema 
        resolver: zodResolver(loginSchema), //menghubungkan validasi form dengan loginSchema menggunakan zodResolver
        defaultValues:{ //menentukan nilai awal field email dan password yaitu kosong
            email: "",
            password: "",
        }
    });

    //fungsi untuk mengirim data dari form setelah di validasi pke loginSchema
    const onSubmit = (values: z.infer<typeof loginSchema>)=> {
        mutate({ json: values });
    }

    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Welcome Back!
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <p className="text-center text-sm">Simplify your workflow and collaboration with team on <b>ProjeX</b>. Get Started for free </p>
            </div>
            <CardContent className="p-7">
                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField name="email" control={form.control} render={({ field })=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email address"
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}/>
                        <FormField name="password" control={form.control} render={({ field })=>(
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
                        )}/>
                        <Button disabled={isPending} size="lg" className="w-full">
                            Login
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardContent className="p-7 flex items-center justify-center">
                <p>
                    Don&apos;t have an account?
                    <Link href="/sign-up">
                        <span className="text-blue-700">
                            &nbsp;Register here
                        </span>
                    </Link>
                </p>

            </CardContent>
        </Card>
    );
};