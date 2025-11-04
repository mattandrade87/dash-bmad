import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Esqueci a Senha | Dashboard Financeiro",
  description: "Recupere sua senha",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Esqueceu a senha?</CardTitle>
            <CardDescription>
              Esta funcionalidade será implementada em breve
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Por enquanto, entre em contato com o suporte para recuperar sua
              senha.
            </p>
          </CardContent>

          <CardFooter>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Voltar para Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
