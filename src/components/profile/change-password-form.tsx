"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export function ChangePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao alterar senha");
      }

      toast.success("Senha alterada com sucesso!", {
        description: "Sua senha foi atualizada.",
      });

      reset();

      // Opcional: redirecionar após sucesso
      setTimeout(() => {
        router.push("/dashboard/settings");
      }, 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao alterar senha"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>
          Mantenha sua conta segura com uma senha forte
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Senha Atual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              <Lock className="inline h-4 w-4 mr-2" />
              Senha Atual
            </Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Digite sua senha atual"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              <Lock className="inline h-4 w-4 mr-2" />
              Nova Senha
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Digite sua nova senha"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mínimo 8 caracteres, com letras maiúsculas, minúsculas e números
            </p>
          </div>

          {/* Confirmar Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">
              <Lock className="inline h-4 w-4 mr-2" />
              Confirmar Nova Senha
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              placeholder="Confirme sua nova senha"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("confirmNewPassword")}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
