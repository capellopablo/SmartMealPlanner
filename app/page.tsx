import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Bienvenido a Smart Meal Planner
        </h1>
        <p className="text-lg text-muted-foreground">
          Tu compañero inteligente para una alimentación saludable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/auth/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 