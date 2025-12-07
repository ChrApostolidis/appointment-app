import { singleProvider } from "../../actions/actions";
import MainButton from "@/app/components/MainButton";

export default function ServiceSection({ provider }: { provider: singleProvider }) {
  return (
    <div className="mt-8 rounded-2xl border border-slate-700/50 bg-background shadow-xl backdrop-blur-sm p-6 md:p-8">
      <div className="mb-4">
        <div className="h-1 w-12 bg-primary rounded-full mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground`">
          About Our Services
        </h2>
      </div>
      <p className="text-base leading-relaxed text-foreground mb-8">
        {provider.description}
      </p>
      <MainButton variant="secondary" className="w-full sm:w-auto">
        Contact Provider
      </MainButton>
    </div>
  );
}
