import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge variant="secondary" className="mb-4">
            v0.1.0 - Setup Completo
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight">
            Dashboard de Finanças Pessoais
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gerencie suas receitas, despesas e metas financeiras de forma
            simples e intuitiva.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Criar Conta</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>💰 Transações</CardTitle>
              <CardDescription>
                Registre suas receitas e despesas com facilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Categorização inteligente</li>
                <li>• Filtros avançados</li>
                <li>• Histórico completo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Dashboard</CardTitle>
              <CardDescription>
                Visualize suas finanças em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Gráficos interativos</li>
                <li>• Métricas em tempo real</li>
                <li>• Análise de gastos</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎯 Metas</CardTitle>
              <CardDescription>
                Defina objetivos e controle seu orçamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Limites de gastos</li>
                <li>• Alertas automáticos</li>
                <li>• Acompanhamento visual</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">Construído com</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Badge variant="outline">Next.js 16</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Tailwind CSS v4</Badge>
            <Badge variant="outline">shadcn/ui</Badge>
            <Badge variant="outline">Prisma</Badge>
            <Badge variant="outline">PostgreSQL</Badge>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Dashboard de Finanças Pessoais - 2025</p>
          <p className="mt-2">
            <Link href="/docs" className="hover:underline">
              Documentação
            </Link>
            {" • "}
            <Link
              href="https://github.com/mattandrade87/dash-bmad"
              className="hover:underline"
            >
              GitHub
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
